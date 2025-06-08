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
exports.RoadmapsController = void 0;
const common_1 = require("@nestjs/common");
const roadmaps_service_1 = require("./roadmaps.service");
const create_user_roadmap_dto_1 = require("./dto/create-user-roadmap.dto");
const create_roadmap_dto_1 = require("./dto/create-roadmap.dto");
const create_roadmap_step_dto_1 = require("./dto/create-roadmap-step.dto");
const update_step_progress_dto_1 = require("./dto/update-step-progress.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../decorators/roles.decorator");
const user_entity_1 = require("../entities/user.entity");
let RoadmapsController = class RoadmapsController {
    roadmapsService;
    constructor(roadmapsService) {
        this.roadmapsService = roadmapsService;
    }
    async createRoadmap(createRoadmapDto, req) {
        return this.roadmapsService.createRoadmap(createRoadmapDto, req.user);
    }
    async createRoadmapStep(id, createRoadmapStepDto, req) {
        return this.roadmapsService.createRoadmapStep(parseInt(id), createRoadmapStepDto, req.user);
    }
    async getAllRoadmaps() {
        return this.roadmapsService.getAllRoadmaps();
    }
    async getRoadmapById(id) {
        return this.roadmapsService.getRoadmapById(parseInt(id));
    }
    async getRoadmapSteps(id) {
        return this.roadmapsService.getRoadmapSteps(parseInt(id));
    }
    async startUserRoadmap(req, createUserRoadmapDto) {
        return this.roadmapsService.startUserRoadmap(req.user.id, createUserRoadmapDto, req.user);
    }
    async getUserRoadmap(id, req) {
        return this.roadmapsService.getUserRoadmap(parseInt(id), req.user.id);
    }
    async getUserRoadmapByRoadmapId(roadmapId, req) {
        return this.roadmapsService.getUserRoadmapByRoadmapId(parseInt(roadmapId), req.user.id);
    }
    async updateStepProgress(id, updateStepProgressDto, req) {
        return this.roadmapsService.updateStepProgress(parseInt(id), updateStepProgressDto, req.user.id);
    }
    async updateStepProgressByRoadmapId(roadmapId, updateStepProgressDto, req) {
        return this.roadmapsService.updateStepProgressByRoadmapId(parseInt(roadmapId), updateStepProgressDto, req.user.id);
    }
};
exports.RoadmapsController = RoadmapsController;
__decorate([
    (0, common_1.Post)('roadmaps'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_roadmap_dto_1.CreateRoadmapDto, Object]),
    __metadata("design:returntype", Promise)
], RoadmapsController.prototype, "createRoadmap", null);
__decorate([
    (0, common_1.Post)('roadmaps/:id/steps'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_roadmap_step_dto_1.CreateRoadmapStepDto, Object]),
    __metadata("design:returntype", Promise)
], RoadmapsController.prototype, "createRoadmapStep", null);
__decorate([
    (0, common_1.Get)('roadmaps'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.LEARNER, user_entity_1.UserRole.ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RoadmapsController.prototype, "getAllRoadmaps", null);
__decorate([
    (0, common_1.Get)('roadmaps/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.LEARNER, user_entity_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RoadmapsController.prototype, "getRoadmapById", null);
__decorate([
    (0, common_1.Get)('roadmaps/:id/steps'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.LEARNER, user_entity_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RoadmapsController.prototype, "getRoadmapSteps", null);
__decorate([
    (0, common_1.Post)('user-roadmaps'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.LEARNER),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_user_roadmap_dto_1.CreateUserRoadmapDto]),
    __metadata("design:returntype", Promise)
], RoadmapsController.prototype, "startUserRoadmap", null);
__decorate([
    (0, common_1.Get)('user-roadmaps/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.LEARNER),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RoadmapsController.prototype, "getUserRoadmap", null);
__decorate([
    (0, common_1.Get)('user-roadmaps/roadmap/:roadmapId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.LEARNER, user_entity_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('roadmapId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RoadmapsController.prototype, "getUserRoadmapByRoadmapId", null);
__decorate([
    (0, common_1.Patch)('user-roadmaps/:id/step-progress'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.LEARNER),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_step_progress_dto_1.UpdateStepProgressDto, Object]),
    __metadata("design:returntype", Promise)
], RoadmapsController.prototype, "updateStepProgress", null);
__decorate([
    (0, common_1.Patch)('user-roadmaps/roadmap/:roadmapId/step-progress'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.LEARNER, user_entity_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('roadmapId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_step_progress_dto_1.UpdateStepProgressDto, Object]),
    __metadata("design:returntype", Promise)
], RoadmapsController.prototype, "updateStepProgressByRoadmapId", null);
exports.RoadmapsController = RoadmapsController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [roadmaps_service_1.RoadmapsService])
], RoadmapsController);
//# sourceMappingURL=roadmaps.controller.js.map