"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThreadsController = void 0;
const common_1 = require("@nestjs/common");
const threads_service_1 = require("./threads.service");
const create_thread_dto_1 = require("./dto/create-thread.dto");
const create_comment_dto_1 = require("./dto/create-comment.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../decorators/roles.decorator");
const user_entity_1 = require("../entities/user.entity");
let ThreadsController = class ThreadsController {
    threadsService;
    constructor(threadsService) {
        this.threadsService = threadsService;
    }
    async createThread(createThreadDto, req) {
        return this.threadsService.createThread(createThreadDto, req.user);
    }
    async getThreadsByRoadmap(roadmapId) {
        return this.threadsService.getThreadsByRoadmap(parseInt(roadmapId));
    }
    async createComment(threadId, createCommentDto, req) {
        return this.threadsService.createComment(parseInt(threadId), createCommentDto, req.user);
    }
    async getCommentsByThread(threadId) {
        return this.threadsService.getCommentsByThread(parseInt(threadId));
    }
};
exports.ThreadsController = ThreadsController;
__decorate([
    (0, common_1.Post)('threads'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.LEARNER),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_thread_dto_1.CreateThreadDto, Object]),
    __metadata("design:returntype", Promise)
], ThreadsController.prototype, "createThread", null);
__decorate([
    (0, common_1.Get)('threads/roadmap/:roadmapId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.LEARNER),
    __param(0, (0, common_1.Param)('roadmapId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ThreadsController.prototype, "getThreadsByRoadmap", null);
__decorate([
    (0, common_1.Post)('threads/:threadId/comments'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.LEARNER),
    __param(0, (0, common_1.Param)('threadId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_comment_dto_1.CreateCommentDto, Object]),
    __metadata("design:returntype", Promise)
], ThreadsController.prototype, "createComment", null);
__decorate([
    (0, common_1.Get)('comments/thread/:threadId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.LEARNER),
    __param(0, (0, common_1.Param)('threadId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ThreadsController.prototype, "getCommentsByThread", null);
exports.ThreadsController = ThreadsController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [threads_service_1.ThreadsService])
], ThreadsController);
//# sourceMappingURL=threads.controller.js.map