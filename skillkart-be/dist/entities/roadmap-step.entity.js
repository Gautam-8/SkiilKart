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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoadmapStep = void 0;
const typeorm_1 = require("typeorm");
let RoadmapStep = class RoadmapStep {
    id;
    roadmapId;
    weekNumber;
    title;
    description;
    type;
    duration;
    roadmap;
    resources;
    userProgress;
    threads;
    createdAt;
    updatedAt;
};
exports.RoadmapStep = RoadmapStep;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], RoadmapStep.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], RoadmapStep.prototype, "roadmapId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], RoadmapStep.prototype, "weekNumber", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], RoadmapStep.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], RoadmapStep.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], RoadmapStep.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], RoadmapStep.prototype, "duration", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('Roadmap', 'steps'),
    (0, typeorm_1.JoinColumn)({ name: 'roadmapId' }),
    __metadata("design:type", Object)
], RoadmapStep.prototype, "roadmap", void 0);
__decorate([
    (0, typeorm_1.OneToMany)('Resource', 'step'),
    __metadata("design:type", Array)
], RoadmapStep.prototype, "resources", void 0);
__decorate([
    (0, typeorm_1.OneToMany)('UserRoadmapProgress', 'step'),
    __metadata("design:type", Array)
], RoadmapStep.prototype, "userProgress", void 0);
__decorate([
    (0, typeorm_1.OneToMany)('Thread', 'step'),
    __metadata("design:type", Array)
], RoadmapStep.prototype, "threads", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], RoadmapStep.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], RoadmapStep.prototype, "updatedAt", void 0);
exports.RoadmapStep = RoadmapStep = __decorate([
    (0, typeorm_1.Entity)('roadmap_steps')
], RoadmapStep);
//# sourceMappingURL=roadmap-step.entity.js.map