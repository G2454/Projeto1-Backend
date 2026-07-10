// Composition Root
// -----------------------------------------------------------------------------
// Único lugar da aplicação onde a Infraestrutura é instanciada e as dependências
// são conectadas (Dependency Injection): repositórios concretos -> services ->
// controllers -> routers. As camadas internas nunca se conhecem por concreto;
// tudo é injetado a partir daqui.

// Infrastructure (implementações concretas dos contratos do Domínio)
import { MongoEventRepository } from '../Infrastructure/Repositories/MongoEventRepository.js';
import { MongoMeetingRepository } from '../Infrastructure/Repositories/MongoMeetingRepository.js';
import { MongoTaskRepository } from '../Infrastructure/Repositories/MongoTaskRepository.js';
import { MongoUserRepository } from '../Infrastructure/Repositories/MongoUserRepository.js';

// Application Services
import { CreateEventService } from '../Application/Services/event/CreateEventService.js';
import { GetEventService } from '../Application/Services/event/GetEventService.js';
import { UpdateEventService } from '../Application/Services/event/UpdateEventService.js';
import { DeleteEventService } from '../Application/Services/event/DeleteEventService.js';
import { CreateMeetingService } from '../Application/Services/meeting/CreateMeetingService.js';
import { GetMeetingService } from '../Application/Services/meeting/GetMeetingService.js';
import { UpdateMeetingService } from '../Application/Services/meeting/UpdateMeetingService.js';
import { DeleteMeetingService } from '../Application/Services/meeting/DeleteMeetingService.js';
import { CreateTaskService } from '../Application/Services/task/CreateTaskService.js';
import { GetTaskService } from '../Application/Services/task/GetTaskService.js';
import { UpdateTaskService } from '../Application/Services/task/UpdateTaskService.js';
import { DeleteTaskService } from '../Application/Services/task/DeleteTaskService.js';
import { CreateUserService } from '../Application/Services/user/CreateUserService.js';
import { AuthenticateUserService } from '../Application/Services/user/AuthenticateUserService.js';

// Presentation
import { EventController } from '../Presentation/Controllers/EventController.js';
import { MeetingController } from '../Presentation/Controllers/MeetingController.js';
import { TaskController } from '../Presentation/Controllers/TaskController.js';
import { UserController } from '../Presentation/Controllers/UserController.js';
import { createEventRouter } from '../Presentation/Routes/eventRoutes.js';
import { createMeetingRouter } from '../Presentation/Routes/meetingRoutes.js';
import { createTaskRouter } from '../Presentation/Routes/taskRoutes.js';
import { createUserRouter } from '../Presentation/Routes/userRoutes.js';

export function buildContainer(collections) {
    // Infrastructure -> implementa os contratos do Domínio
    const eventRepository = new MongoEventRepository(collections.eventsCollection);
    const meetingRepository = new MongoMeetingRepository(collections.meetingsCollection);
    const taskRepository = new MongoTaskRepository(collections.tasksCollection);
    const userRepository = new MongoUserRepository(collections.usersCollection);

    // Application -> recebe os repositórios pelo contrato
    const eventController = new EventController({
        createEventService: new CreateEventService(eventRepository),
        getEventService: new GetEventService(eventRepository),
        updateEventService: new UpdateEventService(eventRepository),
        deleteEventService: new DeleteEventService(eventRepository)
    });

    const meetingController = new MeetingController({
        createMeetingService: new CreateMeetingService(meetingRepository),
        getMeetingService: new GetMeetingService(meetingRepository),
        updateMeetingService: new UpdateMeetingService(meetingRepository),
        deleteMeetingService: new DeleteMeetingService(meetingRepository)
    });

    const taskController = new TaskController({
        createTaskService: new CreateTaskService(taskRepository),
        getTaskService: new GetTaskService(taskRepository),
        updateTaskService: new UpdateTaskService(taskRepository),
        deleteTaskService: new DeleteTaskService(taskRepository)
    });

    const userController = new UserController({
        createUserService: new CreateUserService(userRepository),
        authenticateUserService: new AuthenticateUserService(userRepository)
    });

    // Presentation -> routers prontos para serem montados no app
    return {
        userRouter: createUserRouter(userController),
        eventRouter: createEventRouter(eventController),
        meetingRouter: createMeetingRouter(meetingController),
        taskRouter: createTaskRouter(taskController)
    };
}