import { HTAModule, LearningActivity, AssessmentMethod, Reference, ModuleType, AssessmentType, LearningActivityType, HTAProgram } from '@/types/htaProgram';

export const htaModules: HTAModule[] = [];

export const htaProgramStructure: HTAProgram = {
  id: 'empty-program',
  title: 'HTA Program',
  description: 'Health Technology Assessment Program',
  modules: [],
  totalDuration: 0,
  startDate: '',
  endDate: '',
  isActive: false,
  createdAt: '',
  updatedAt: ''
};