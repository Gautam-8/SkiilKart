"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseSeeder = void 0;
const roadmap_entity_1 = require("./entities/roadmap.entity");
const roadmap_step_entity_1 = require("./entities/roadmap-step.entity");
const resource_entity_1 = require("./entities/resource.entity");
const badge_entity_1 = require("./entities/badge.entity");
class DatabaseSeeder {
    dataSource;
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async seed() {
        console.log('🌱 Starting database seeding...');
        const roadmaps = [
            {
                title: 'Complete Web Development Bootcamp',
                skillCategory: 'Web Development',
                description: 'Learn full-stack web development from scratch with HTML, CSS, JavaScript, React, and Node.js',
                totalWeeks: 12
            },
            {
                title: 'Frontend Development Mastery',
                skillCategory: 'Frontend Development',
                description: 'Master modern frontend development with React, TypeScript, and advanced CSS',
                totalWeeks: 8
            },
            {
                title: 'UI/UX Design Fundamentals',
                skillCategory: 'UI/UX Design',
                description: 'Learn design principles, user research, prototyping, and design systems',
                totalWeeks: 10
            },
            {
                title: 'Data Science with Python',
                skillCategory: 'Data Science',
                description: 'Master data analysis, machine learning, and visualization with Python',
                totalWeeks: 14
            },
            {
                title: 'Mobile App Development',
                skillCategory: 'Mobile Development',
                description: 'Build native mobile apps with React Native and Flutter',
                totalWeeks: 10
            }
        ];
        const roadmapRepository = this.dataSource.getRepository(roadmap_entity_1.Roadmap);
        const stepRepository = this.dataSource.getRepository(roadmap_step_entity_1.RoadmapStep);
        const resourceRepository = this.dataSource.getRepository(resource_entity_1.Resource);
        const badgeRepository = this.dataSource.getRepository(badge_entity_1.Badge);
        await resourceRepository.delete({});
        await stepRepository.delete({});
        await roadmapRepository.delete({});
        await badgeRepository.delete({});
        for (const roadmapData of roadmaps) {
            console.log(`Creating roadmap: ${roadmapData.title}`);
            const roadmap = roadmapRepository.create(roadmapData);
            await roadmapRepository.save(roadmap);
            const stepCount = Math.min(roadmapData.totalWeeks, 4);
            for (let week = 1; week <= stepCount; week++) {
                const stepTitle = this.getStepTitle(roadmapData.skillCategory, week);
                const stepDescription = this.getStepDescription(roadmapData.skillCategory, week);
                const step = stepRepository.create({
                    roadmapId: roadmap.id,
                    weekNumber: week,
                    title: stepTitle,
                    description: stepDescription
                });
                await stepRepository.save(step);
                const resourceCount = Math.floor(Math.random() * 2) + 2;
                for (let i = 0; i < resourceCount; i++) {
                    const resourceType = [resource_entity_1.ResourceType.VIDEO, resource_entity_1.ResourceType.BLOG, resource_entity_1.ResourceType.QUIZ][i % 3];
                    const resource = resourceRepository.create({
                        stepId: step.id,
                        title: this.getResourceTitle(roadmapData.skillCategory, week, resourceType),
                        type: resourceType,
                        url: this.getResourceUrl(resourceType, roadmapData.skillCategory)
                    });
                    await resourceRepository.save(resource);
                }
            }
        }
        const badges = [
            { name: 'Getting Started', description: 'Complete your first roadmap step' },
            { name: 'Roadmap Finisher', description: 'Complete an entire roadmap' },
            { name: 'Streak Master', description: 'Log in for 5 consecutive days' },
            { name: 'Knowledge Seeker', description: 'Complete 10 roadmap steps' },
            { name: 'Community Helper', description: 'Help 5 other learners in discussions' }
        ];
        for (const badgeData of badges) {
            const badge = badgeRepository.create(badgeData);
            await badgeRepository.save(badge);
        }
        console.log('✅ Database seeding completed!');
    }
    getStepTitle(skillCategory, week) {
        const stepTitles = {
            'Web Development': [
                'HTML & CSS Fundamentals',
                'JavaScript Basics',
                'React Introduction',
                'Backend with Node.js'
            ],
            'Frontend Development': [
                'Modern CSS & Flexbox',
                'JavaScript ES6+',
                'React Hooks & State',
                'TypeScript Basics'
            ],
            'UI/UX Design': [
                'Design Principles',
                'User Research Methods',
                'Wireframing & Prototyping',
                'Design Systems'
            ],
            'Data Science': [
                'Python Fundamentals',
                'Data Analysis with Pandas',
                'Data Visualization',
                'Machine Learning Basics'
            ],
            'Mobile Development': [
                'Mobile Design Patterns',
                'React Native Basics',
                'Navigation & State',
                'API Integration'
            ]
        };
        return stepTitles[skillCategory]?.[week - 1] || `Week ${week} - Advanced Topics`;
    }
    getStepDescription(skillCategory, week) {
        return `Master the essential concepts and practical skills for week ${week} of ${skillCategory}. Build hands-on projects and gain real-world experience.`;
    }
    getResourceTitle(skillCategory, week, type) {
        const titles = {
            [resource_entity_1.ResourceType.VIDEO]: `${skillCategory} Week ${week} - Video Tutorial`,
            [resource_entity_1.ResourceType.BLOG]: `${skillCategory} Week ${week} - Complete Guide`,
            [resource_entity_1.ResourceType.QUIZ]: `${skillCategory} Week ${week} - Knowledge Check`
        };
        return titles[type];
    }
    getResourceUrl(type, skillCategory) {
        const urls = {
            [resource_entity_1.ResourceType.VIDEO]: 'https://youtube.com/watch?v=example',
            [resource_entity_1.ResourceType.BLOG]: 'https://medium.com/example-article',
            [resource_entity_1.ResourceType.QUIZ]: 'https://quiz.example.com/test'
        };
        return urls[type];
    }
}
exports.DatabaseSeeder = DatabaseSeeder;
//# sourceMappingURL=seed.js.map