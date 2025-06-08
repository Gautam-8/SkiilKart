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
exports.UserRoadmapProgress = exports.ProgressStatus = void 0;
const typeorm_1 = require("typeorm");
var ProgressStatus;
(function (ProgressStatus) {
    ProgressStatus["IN_PROGRESS"] = "In Progress";
    ProgressStatus["COMPLETED"] = "Completed";
})(ProgressStatus || (exports.ProgressStatus = ProgressStatus = {}));
let UserRoadmapProgress = class UserRoadmapProgress {
    id;
    userRoadmapId;
    stepId;
    status;
    userRoadmap;
    step;
    createdAt;
    updatedAt;
};
exports.UserRoadmapProgress = UserRoadmapProgress;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], UserRoadmapProgress.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], UserRoadmapProgress.prototype, "userRoadmapId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], UserRoadmapProgress.prototype, "stepId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ProgressStatus,
        default: ProgressStatus.IN_PROGRESS,
    }),
    __metadata("design:type", String)
], UserRoadmapProgress.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('UserRoadmap', 'progress'),
    (0, typeorm_1.JoinColumn)({ name: 'userRoadmapId' }),
    __metadata("design:type", Object)
], UserRoadmapProgress.prototype, "userRoadmap", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)('RoadmapStep', 'userProgress', { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'stepId' }),
    __metadata("design:type", Object)
], UserRoadmapProgress.prototype, "step", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], UserRoadmapProgress.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], UserRoadmapProgress.prototype, "updatedAt", void 0);
exports.UserRoadmapProgress = UserRoadmapProgress = __decorate([
    (0, typeorm_1.Entity)('user_roadmap_progress')
], UserRoadmapProgress);
//# sourceMappingURL=user-roadmap-progress.entity.js.map