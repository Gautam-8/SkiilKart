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
exports.CreateRoadmapStepDto = exports.StepType = void 0;
const class_validator_1 = require("class-validator");
var StepType;
(function (StepType) {
    StepType["VIDEOS"] = "Videos";
    StepType["BLOGS"] = "Blogs";
    StepType["QUIZZES"] = "Quizzes";
})(StepType || (exports.StepType = StepType = {}));
class CreateRoadmapStepDto {
    title;
    description;
    type;
    roadmapId;
    estimatedHours;
    learningObjectives;
}
exports.CreateRoadmapStepDto = CreateRoadmapStepDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRoadmapStepDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateRoadmapStepDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(StepType),
    __metadata("design:type", String)
], CreateRoadmapStepDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateRoadmapStepDto.prototype, "roadmapId", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateRoadmapStepDto.prototype, "estimatedHours", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateRoadmapStepDto.prototype, "learningObjectives", void 0);
//# sourceMappingURL=create-roadmap-step.dto.js.map