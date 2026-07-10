# DDD Study Guide — Calendar API

A guide to the Domain-Driven Design concepts behind the refactor of this project,
written so you can study the theory **and** see exactly where it lives in the code.

**References**
- Eric Evans — *Domain-Driven Design: Tackling Complexity in the Heart of Software* (the origin book)
- David Laribee — [*Best Practice: An Introduction to Domain-Driven Design*, MSDN Magazine, Feb 2009](https://learn.microsoft.com/en-us/archive/msdn-magazine/2009/february/best-practice-an-introduction-to-domain-driven-design) — the article most of the terminology below is drawn from.

> Laribee's core message: *the code is not the true model — it's a shadow of it.*
> DDD is the discipline of getting the code closer to the business "Form" over time
> by (1) speaking a shared language, (2) drawing boundaries, and (3) putting behavior
> where it belongs. Everything below serves those three goals.

---

## Table of contents
1. [The building blocks (theory → this repo)](#1-the-building-blocks)
2. [The layered architecture we adopted](#2-the-layered-architecture)
3. [What changed in the refactor (before → after)](#3-what-changed-in-the-refactor)
4. [Walkthrough: the life of one request](#4-walkthrough-the-life-of-one-request)
5. [Where this project is still "DDD-lite" (study exercises)](#5-where-this-project-is-still-ddd-lite)
6. [Glossary & further reading](#6-glossary--further-reading)

---

## 1. The building blocks

Laribee introduces DDD as *"a collection of principles and patterns that help
developers craft elegant object systems."* Here is each pattern, its definition,
and where (or whether) it appears in this codebase.

### Ubiquitous Language
**Theory.** A shared vocabulary used by developers *and* domain experts, and
reflected directly in the code. *"If the terms 'class code' or 'exposure' are
frequently used in conversation, I would expect to find corresponding class names
in the code."* Each Bounded Context owns its own language.

**In this repo.** The domain nouns — `Event`, `Meeting`, `Task`, `User` — are the
class names ([src/Domain/Entities/](../src/Domain/Entities/)). The verbs the
business cares about are the service names: `CreateEventService`, `AuthenticateUserService`.
When you read `AuthenticateUserService.execute()` you know what it does without
reading infrastructure code — that alignment *is* the ubiquitous language at work.

### Bounded Context & Modules
**Theory.** A *Bounded Context* is a coarse-grained area of responsibility with its
own model and language; keeping them separate avoids the *"Big Ball of Mud."*
*Modules* (namespaces/folders) organise a single model into cohesive chunks.

**In this repo.** This app is small enough to be a **single Bounded Context** (a
personal calendar). We do not have separate contexts — but we *do* use **modules**:
each aggregate (`event`, `meeting`, `task`, `user`) is its own sub-folder inside
every layer. That folder-per-aggregate layout is the "modules" idea applied at small
scale. See the [exercises](#5-where-this-project-is-still-ddd-lite) for how you would
split contexts if this grew.

### Layered architecture & Dependency Inversion
**Theory.** Laribee separates the *pure domain model* from *infrastructure*
(*"Persistence is infrastructure"*) and from the *application/presentation* edges.
Dependencies must point **inward**, toward the domain. Infrastructure depends on the
domain, never the reverse.

**In this repo — this is the heart of the refactor.**

```
Presentation  (Controllers / Routes / Middlewares)
      ↓ depends on
Application   (Services [use cases], DTOs)
      ↓ depends on
Domain        (Entities, Repository interfaces)   ← depends on NOTHING outside
      ↑ implemented by
Infrastructure (Mongo repositories, DB connection)
```

The key trick that makes this legal is that the **Domain owns the repository
interface**, and Infrastructure implements it. So even though data physically flows
*out* to MongoDB, the *dependency* points *in*. This is the Dependency Inversion
Principle, and it is what lets the domain stay ignorant of Mongo. See
[section 2](#2-the-layered-architecture).

### Entities
**Theory.** *"An entity is a 'thing' in your system… people, places, and things."*
Entities have **identity** and a **lifecycle**, and — crucially — *"think of entities
as units of behavior rather than as units of data. Try to put your logic in the
entities that own them."*

**In this repo.** [Domain/Entities/](../src/Domain/Entities/). Each has an identity
(`id`) and enforces its own invariants instead of letting a controller do it:

```js
// src/Domain/Entities/Event.js
static create({ name, date, location, description }) {
    if (!name || !date) {
        throw new Error("Campos 'name' e 'date' são obrigatórios.");
    }
    return new Event({ name, date, location, description });
}
```

`Task` even carries behavior (`markComplete()`), and `User` owns
`authenticate()` and password hashing — logic lives *with* the data it guards, per
Laribee's advice.

> **`create()` vs `restore()`** — a subtlety worth understanding.
> `create()` builds a *brand-new* entity and runs the business rules.
> `restore()` *reconstitutes* an entity already stored in the database — it must
> **not** re-validate or reset `createdAt`, because that data was valid when first
> created. Mixing these up is a classic beginner bug (the original code reset
> `createdAt` on every load).

### Value Objects
**Theory.** *"Value objects are descriptors… they do not have an identity; they
simply describe the things that do."* They are **immutable** and give side-effect-free
functions (Laribee's example: `Money`).

**In this repo.** We do **not** have explicit Value Objects yet — fields like
`location` and `date` are plain primitives. This is a deliberate simplification and a
great learning exercise: see [section 5](#5-where-this-project-is-still-ddd-lite) for
how you'd introduce a `DateRange` or `Email` value object.

### Aggregate Roots
**Theory.** *"An aggregate root is a special kind of entity that consumers refer to
directly… the only kind of entity to which your software may hold a reference."* The
root guards its child entities and enforces consistency. Rule of thumb: **one
repository per aggregate root**. Laribee also warns against "deep dotting"
(`Policy.CurrentPeriod().Renew()` violates the Law of Demeter — prefer `Policy.Renew()`).

**In this repo.** Each entity here is a **trivial aggregate root** — a root with no
child entities (an `Event` has no sub-collection). That's why there is exactly **one
repository per entity**, matching the "one repository per aggregate root" rule. If a
`Task` later owned a list of `SubTask` entities, `Task` would become a "real"
aggregate root that creates/validates its children and is the only thing the
`TaskRepository` returns.

### Repositories
**Theory.** *"Repositories represent an in-memory collection… they prevent database
or persistence concepts, such as SQL statements, from commingling with your model."*
Laribee notes repositories are *"actually a type of Anti-Corruption Layer"* and shows
a generic `IRepository<T>` interface (the *Layer Supertype* pattern).

**In this repo — the "interfaces to call for the repository" you asked for.**
JavaScript has no `interface` keyword, so a repository contract is expressed as an
**abstract base class** whose methods throw until overridden:

```js
// src/Domain/Repositories/EventRepository.js  (the CONTRACT, owned by the Domain)
export class EventRepository {
    async save(event)      { throw new Error("EventRepository.save() não implementado."); }
    async findById(id)     { throw new Error("EventRepository.findById() não implementado."); }
    async findAll()        { throw new Error("EventRepository.findAll() não implementado."); }
    async update(id, e)    { throw new Error("EventRepository.update() não implementado."); }
    async delete(id)       { throw new Error("EventRepository.delete() não implementado."); }
}
```

```js
// src/Infrastructure/Repositories/MongoEventRepository.js  (the IMPLEMENTATION)
export class MongoEventRepository extends EventRepository {
    constructor(dbCollection) { super(); this.collection = dbCollection; }
    // ...ObjectId, insertOne, findOne, etc. — Mongo details stay HERE, never leak inward
    _toDomain(data) { return Event.restore({ id: data._id, /* ... */ }); }
}
```

The repository is the **Anti-Corruption Layer**: `ObjectId`, `insertOne`, and the
`_id`→`id` mapping all live in the Mongo class and never reach the domain or the
services. Note `_toDomain` returns a real `Event` entity (via `restore`), not a raw
DB document — so callers always get behavior-rich domain objects.

### Domain Services vs Application Services
**Theory.** Laribee distinguishes two kinds of "service":
- **Domain Service** — models a *business operation* that doesn't naturally belong to
  a single entity (his example: `PolicyRenewalProcessor`). Named after a verb from the
  ubiquitous language. Stateless, highly cohesive.
- **Application Service** — the *layer* that orchestrates a use case: fetches
  aggregates from repositories, calls domain behavior, maps to DTOs, and brings in
  infrastructure concerns. *"Application services… are a great way to introduce a
  layered architecture."* His `PolicyService.Renew(PolicyRenewalDTO)` is the template.

**In this repo.** What we call **Services** are **Application Services** — one class
per use case, orchestrating repository + entity:

```js
// src/Application/Services/user/CreateUserService.js
async execute(createUserDTO) {
    const existingUser = await this.userRepository.findByUsername(createUserDTO.username);
    if (existingUser) throw new Error("Usuário já existe");   // use-case rule
    const user = await User.create(createUserDTO);            // domain rule (hashing, validation)
    return await this.userRepository.save(user);
}
```

Compare directly to Laribee's `PolicyService.Renew` in Figure 4 — same shape: take a
DTO, find via repository, invoke entity behavior, persist. We have **no Domain
Services** yet because no operation currently spans multiple entities (see exercises).

> **Naming note:** you asked to rename `UseCase` → `Services`. "Use case" and
> "application service" are the same concept under two names (Clean Architecture says
> "use case"; classic DDD says "application service"). We kept your chosen name,
> `*Service`, and placed them in the **Application** layer where they belong.

### Factories
**Theory.** (From the Evans book, referenced by the article's building-block set.) A
Factory encapsulates the knowledge of how to create a valid entity/aggregate, so
construction rules don't leak to callers.

**In this repo.** The static `Entity.create(...)` methods **are** factories — they are
the single place that knows how to build a valid `Event`/`User`. `User.create` is an
`async` factory because it must hash the password before the object can exist.

### DTOs (Data Transfer Objects)
**Theory.** Laribee shows DTOs (`PolicyRenewalDTO`) as the *shape data takes at the
application boundary* — decoupling the outside world from the internal object graph.

**In this repo.** [Application/DTOs/](../src/Application/DTOs/). Each `fromRequest()`
**whitelists** the accepted fields (preventing mass-assignment of raw `req.body`) and
does input-level validation:

```js
// src/Application/DTOs/user/CreateUserDTO.js
static fromRequest(body = {}) {
    const { username, password, email } = body;
    if (!username || !password) throw new Error("Username e password são obrigatórios");
    if (password.length < 6)    throw new Error("Senha deve ter no mínimo 6 caracteres");
    return new CreateUserDTO({ username, password, email });
}
```

Two levels of validation, on purpose: the **DTO** guards *input shape* (is the request
well-formed?); the **entity** guards *business invariants* (is this a legal `Event`?).

### Anti-Corruption Layer (ACL)
**Theory.** *"Gatekeepers that work to prevent non-domain concepts from leaking into
your model."* Repositories are one example.

**In this repo.** Two ACLs: the **Mongo repositories** (keep Mongo out of the domain)
and the **DTOs** (keep raw HTTP `req.body` out of the services/entities).

---

## 2. The layered architecture

### The dependency rule
Source-code dependencies may only point **inward**. The Domain is the centre and
imports nothing from the other layers. Concretely:

| Layer | May import from | Must NOT import from |
|-------|-----------------|----------------------|
| **Presentation** | Application | Infrastructure, Mongo |
| **Application** | Domain | Presentation, Infrastructure, Mongo |
| **Domain** | *(nothing internal)* | everything else |
| **Infrastructure** | Domain (to implement its interfaces) | Presentation, Application |

### Folder map
```
src/
  Presentation/          ← HTTP edge; knows Express, sessions, req/res
    Controllers/         EventController, MeetingController, TaskController, UserController
    Routes/              createXRouter(controller) — binds URLs to controller methods
    Middlewares/         requireLogin
  Application/           ← orchestration; knows Domain only
    Services/            CreateEventService, GetEventService, ... (one per use case)
    DTOs/                CreateEventDTO, LoginDTO, ... (boundary shapes + input validation)
  Domain/                ← the model; pure, dependency-free
    Entities/            Event, Meeting, Task, User (identity + behavior + invariants)
    Repositories/        EventRepository, ... (abstract CONTRACTS — the "interfaces")
  Infrastructure/        ← implementation details
    Repositories/        MongoEventRepository extends EventRepository, ...
    Database/            mongoClient (connection + collection setup)
  composition/
    container.js         ← Composition Root: wires repos → services → controllers → routers
  shared/
    config/swagger.js
app.js                   ← Express assembly (consumes the container)
index.js                 ← entry point: connect DB → build container → build app → listen
```

### The Composition Root (Dependency Injection)
Nothing in the inner layers ever calls `new MongoEventRepository()`. **One** file —
[src/composition/container.js](../src/composition/container.js) — instantiates the
concrete infrastructure and injects it inward:

```
MongoEventRepository ──▶ CreateEventService ──▶ EventController ──▶ createEventRouter
     (Infrastructure)         (Application)        (Presentation)        (Presentation)
```

Because the wiring is centralised, the `EventController` only ever knows the
*services* it was handed, and a service only knows the *repository interface* it was
handed. To swap MongoDB for Postgres you would write one new
`PostgresEventRepository extends EventRepository` and change one line in the container
— **no controller, service, or entity changes.** That is the payoff of the whole
structure.

---

## 3. What changed in the refactor

### Before
```
src/
  API/Controllers/        ← routes that did `new MongoEventRepository(...)` themselves
  Domain/
    Models/               ← entities (files lowercase: event.js, imported as Event.js)
    UseCase/              ← application logic living INSIDE the Domain layer
  Infrastructure/Repository/   ← Mongo classes with no shared contract
  shared/middlewares/
index.js                  ← DB connection + collection setup + `main()` called twice
```

Problems:
- Controllers imported and instantiated **concrete Mongo classes** → Presentation
  depended on Infrastructure (dependency pointing the wrong way).
- **No repository contract** → nothing enforced or documented the shape a repository
  must have; no way to invert the dependency.
- Use cases lived under `Domain/` → application orchestration mixed into the pure model.
- Repos returned **plain objects**, not entities → behavior lost after a DB read.
- Latent bugs: lowercase entity filenames (break on case-sensitive Linux), `createdAt`
  reset on every load, `main()` invoked twice.

### After — change summary

| Area | Before | After | Why (DDD principle) |
|------|--------|-------|---------------------|
| Entities | `Domain/Models/*` | `Domain/Entities/*` + `restore()` | Entities have identity **and** a lifecycle; reconstitution ≠ creation |
| Repo contract | *none* | `Domain/Repositories/*` (abstract classes) | Dependency Inversion; the "interface" you asked for |
| Repo impl. | `Infrastructure/Repository/*` (standalone) | `Infrastructure/Repositories/*` **`extends`** the contract, returns entities | Repository as Anti-Corruption Layer |
| Use cases | `Domain/UseCase/*UseCase` | `Application/Services/*Service` | Application Services belong in the Application layer, not the Domain |
| Input shape | raw `req.body` passed through | `Application/DTOs/*` with `fromRequest()` | DTO as boundary ACL + input validation |
| Controllers | built repos + use cases inline | thin classes, **services injected**, only call services | Presentation must not know Infrastructure |
| Routes | mixed into controller file | `Presentation/Routes/createXRouter(controller)` | Separation of routing from handling |
| Wiring | scattered in each route file | one **Composition Root** (`container.js`) | Single place for DI; inner layers stay pure |
| DB setup | inline in `index.js` | `Infrastructure/Database/mongoClient.js` | Persistence is infrastructure |
| Config | empty `DB_CLUSTER_HOST` string | `process.env.MONGO_URI` | Config out of source |

### Verification performed
The refactor was driven end-to-end through the **real** controllers → services →
entities → Mongo repositories (only the Mongo *collection* object was faked at the
driver boundary). All 23 checks passed: auth guard (401), register/login/logout,
full Event CRUD, DTO field whitelisting, invalid-input 400s, and the mirrored
meeting/task aggregates.

---

## 4. Walkthrough: the life of one request

Trace `POST /api/events` with body `{ "name": "Sync", "date": "2026-08-01" }`:

1. **Route** — [eventRoutes.js](../src/Presentation/Routes/eventRoutes.js) matches
   `POST /` and first runs `requireLogin` (rejects with 401 if no session), then calls
   `eventController.create`.
2. **Controller** — [EventController.js](../src/Presentation/Controllers/EventController.js)
   builds `CreateEventDTO.fromRequest(req.body)` (whitelists fields) and calls
   `createEventService.execute(dto)`. It knows nothing about Mongo.
3. **Application Service** — [CreateEventService.js](../src/Application/Services/event/CreateEventService.js)
   calls `Event.create(dto)` (the factory — runs business invariants) then
   `eventRepository.save(event)`. It depends on the **`EventRepository` contract**,
   not the Mongo class.
4. **Entity** — [Event.js](../src/Domain/Entities/Event.js) `create()` enforces
   "name and date required" and returns a valid `Event`.
5. **Repository (Infrastructure)** — at runtime the injected
   [MongoEventRepository](../src/Infrastructure/Repositories/MongoEventRepository.js)
   translates the entity to a document, `insertOne`s it, sets the generated `id`, and
   returns the entity. All Mongo specifics stay here.
6. **Response** — the controller wraps the result: `201 { message, data }`.

Notice the dependency direction: every arrow *out* to the database was made through
an interface the **Domain** defined, so the Domain never learned that Mongo exists.

---

## 5. Where this project is still "DDD-lite"

DDD is a spectrum, and Laribee stresses *value over dogma*: *"Understanding your core
domain… [is] way more important than nailing that perfectly opaque, one-size-fits-all
repository."* This app applies the structural patterns but keeps the model simple.
Good study exercises to push it further:

1. **Introduce a Value Object.** Replace the primitive `email` string with an `Email`
   value object that validates format and is immutable; or model an event's
   start/end as a `DateRange` value object that guarantees `end > start`. (Theory:
   [Value Objects](#value-objects).)
2. **Grow a real Aggregate.** Give `Task` a collection of `SubTask` child entities.
   `Task` becomes an aggregate root that creates/validates its children; the
   `TaskRepository` still returns only `Task`. Watch the "one repository per aggregate
   root" rule pay off. (Theory: [Aggregate Roots](#aggregate-roots).)
3. **Extract a Domain Service.** Add a rule like *"a Meeting cannot overlap an
   existing Meeting."* That spans multiple `Meeting` entities, so it belongs in a
   `MeetingSchedulingService` (a **domain** service), not in a single entity.
   (Theory: [Domain Services](#domain-services-vs-application-services).)
4. **Fix a lurking modeling bug.** `UpdateTaskService` calls `Task.create()`, which
   resets `completed` to `false` — so editing a task silently un-completes it. A truer
   model would load the existing aggregate, mutate it (`task.rename(...)`), and save.
   This is exactly the *"entities as units of behavior"* idea.
5. **Split a Bounded Context.** If "scheduling" and "user identity/auth" grew, they
   would become two Bounded Contexts, each with its own model and language, integrated
   via an application service — Laribee's context-map idea.
6. **Ownership of IDs.** Today `id` is a Mongo `ObjectId` that leaks its type into the
   entity via `restore`. A stricter domain would use its own identity type and let the
   repository map to/from `ObjectId` — tightening the Anti-Corruption Layer.

---

## 6. Glossary & further reading

| Term | One-line definition | Here |
|------|--------------------|------|
| Ubiquitous Language | Shared business vocabulary reflected in code | entity/service names |
| Bounded Context | Coarse area of responsibility with its own model | whole app = 1 context |
| Module | Cohesive grouping within a context | per-aggregate folders |
| Entity | Thing with identity + lifecycle + behavior | `Domain/Entities/*` |
| Value Object | Immutable descriptor, no identity | *(exercise)* |
| Aggregate Root | The entity consumers reference; guards children | each entity (trivial roots) |
| Factory | Encapsulates valid construction | `Entity.create()` |
| Repository | In-memory-collection illusion over storage; an ACL | contract in Domain, impl in Infra |
| Domain Service | Business operation spanning entities | *(exercise)* |
| Application Service | Orchestrates a use case, maps DTOs | `Application/Services/*` |
| DTO | Boundary data shape | `Application/DTOs/*` |
| Anti-Corruption Layer | Gatekeeper keeping foreign concepts out | repositories + DTOs |
| Dependency Inversion | Inner layers define interfaces, outer implement | `Domain/Repositories` ← `Infrastructure` |
| Composition Root | Single place that wires dependencies | `composition/container.js` |

**Read next**
- David Laribee, [*Best Practice: An Introduction to Domain-Driven Design*](https://learn.microsoft.com/en-us/archive/msdn-magazine/2009/february/best-practice-an-introduction-to-domain-driven-design) (the reference for this guide)
- Eric Evans, *Domain-Driven Design* (the "blue book") — start with the InfoQ free short version if budget-limited
- Robert C. Martin, [the S.O.L.I.D. principles](https://butunclebob.com/articles.unclebob.principlesofood) — especially Single Responsibility & Dependency Inversion
- Martin Fowler, [Layer Supertype](https://martinfowler.com/eaacatalog/layersupertype.html) — the pattern behind the abstract repository base class
