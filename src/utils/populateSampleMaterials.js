// Test script to populate course materials for fellows
// This would normally be done when staff uploads materials

const sampleCourseMaterials = [
  {
    id: 'sample-1',
    name: 'Introduction to Health Economics.pdf',
    type: 'pdf',
    size: 245760,
    description: 'Comprehensive introduction to health economics principles',
    uploadedAt: '2024-01-15T10:00:00Z',
    downloadable: true,
    url: 'data:application/pdf;base64,JVBERi0xLjQKJcOkw7zDtsO8CjIgMCBvYmoKPDwKL0xlbmd0aCAzIDAgUgovRmlsdGVyIC9GbGF0ZURlY29kZQo+PgpzdHJlYW0K'
  },
  {
    id: 'sample-2',
    name: 'Economic Evaluation Methods.pptx',
    type: 'pptx',
    size: 15728640,
    description: 'PowerPoint presentation on economic evaluation methodologies',
    uploadedAt: '2024-01-16T14:30:00Z',
    downloadable: true,
    url: 'data:application/vnd.openxmlformats-officedocument.presentationml.presentation;base64,UEsDBBQAAAAIAA=='
  },
  {
    id: 'sample-3',
    name: 'Cost-Benefit Analysis Template.xlsx',
    type: 'other',
    size: 32768,
    description: 'Excel template for conducting cost-benefit analysis',
    uploadedAt: '2024-01-17T09:15:00Z',
    downloadable: true,
    url: 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,UEsDBBQAAAAIAA=='
  },
  {
    id: 'sample-4',
    name: 'Healthcare Market Analysis.pdf',
    type: 'pdf',
    size: 524288,
    description: 'Detailed analysis of healthcare market structures',
    uploadedAt: '2024-01-18T16:45:00Z',
    downloadable: true,
    url: 'data:application/pdf;base64,JVBERi0xLjQKJcOkw7zDtsO8CjIgMCBvYmoKPDwKL0xlbmd0aCAzIDAgUgovRmlsdGVyIC9GbGF0ZURlY29kZQo+PgpzdHJlYW0K'
  }
];

// Store sample materials for course ID '1' (the first course in FellowCourses)
localStorage.setItem('course_materials_1', JSON.stringify(sampleCourseMaterials));

console.log('Sample course materials added to localStorage for course ID 1');
console.log('Materials:', sampleCourseMaterials);


















