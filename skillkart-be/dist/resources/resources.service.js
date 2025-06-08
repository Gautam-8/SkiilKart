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
exports.ResourcesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const resource_entity_1 = require("../entities/resource.entity");
const roadmap_step_entity_1 = require("../entities/roadmap-step.entity");
const user_entity_1 = require("../entities/user.entity");
let ResourcesService = class ResourcesService {
    resourceRepository;
    roadmapStepRepository;
    constructor(resourceRepository, roadmapStepRepository) {
        this.resourceRepository = resourceRepository;
        this.roadmapStepRepository = roadmapStepRepository;
    }
    async createResource(createResourceDto, user) {
        if (user.role !== user_entity_1.UserRole.ADMIN) {
            throw new common_1.ForbiddenException('Only admins can create resources');
        }
        const { stepId } = createResourceDto;
        const step = await this.roadmapStepRepository.findOne({
            where: { id: stepId },
        });
        if (!step) {
            throw new common_1.NotFoundException('Roadmap step not found');
        }
        const resource = this.resourceRepository.create(createResourceDto);
        await this.resourceRepository.save(resource);
        return resource;
    }
    async getResourcesByStep(stepId) {
        const step = await this.roadmapStepRepository.findOne({
            where: { id: stepId },
        });
        if (!step) {
            throw new common_1.NotFoundException('Roadmap step not found');
        }
        const resources = await this.resourceRepository.find({
            where: { stepId },
            order: { createdAt: 'ASC' },
        });
        return resources;
    }
    async deleteResource(id, user) {
        if (user.role !== user_entity_1.UserRole.ADMIN) {
            throw new common_1.ForbiddenException('Only admins can delete resources');
        }
        const resource = await this.resourceRepository.findOne({
            where: { id },
        });
        if (!resource) {
            throw new common_1.NotFoundException('Resource not found');
        }
        await this.resourceRepository.remove(resource);
        return { success: true, message: 'Resource deleted successfully' };
    }
};
exports.ResourcesService = ResourcesService;
exports.ResourcesService = ResourcesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(resource_entity_1.Resource)),
    __param(1, (0, typeorm_1.InjectRepository)(roadmap_step_entity_1.RoadmapStep)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ResourcesService);
//# sourceMappingURL=resources.service.js.map