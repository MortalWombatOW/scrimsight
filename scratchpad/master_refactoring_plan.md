# Master Refactoring Plan

## Executive Summary

This master plan consolidates findings from component (Task 4), page (Task 5), and library (Task 6) compliance investigations into a comprehensive, prioritized refactoring strategy. The project requires significant restructuring to achieve full compliance with the new ESLint-enforced project standards.

**Overall Project Compliance**: 🔴 **7% compliant** across all areas  
**Total Items Requiring Attention**: 200+ violations across 3 major areas  
**Estimated Total Effort**: 🔥 **XXXL** (6-12 weeks of focused development)

---

## Critical Blocker Summary

### 🚨 **ESLint Compilation Blockers** (MUST FIX FIRST)
1. **22 folder structure violations** (13 pages + 9 components)
2. **5 module dependency violations** (library imports)
3. **2 TypeScript compilation errors** (duplicate exports)
4. **1 React Hooks violation** (conditional hook usage)

### 📋 **Missing Required Files** 
- **29 missing Storybook files** (14 pages + 4 components + 11 existing need updates)
- **15 missing test files** (entire library has 0% test coverage)

---

## Consolidated Issue Inventory

### Components (src/components/) - 0% Compliant ❌
| Issue Category | Count | Severity | Effort |
|----------------|-------|----------|--------|
| Folder structure violations | 9 | Critical | XL |
| Missing Storybook files | 4 | High | S |
| Import/export violations | 25+ | Medium | M |
| Component relocations needed | 35+ | Medium | L |

### Pages (src/pages/) - 0% Compliant ❌
| Issue Category | Count | Severity | Effort |
|----------------|-------|----------|--------|
| Folder structure violations | 13 | Critical | XL |
| Missing Storybook files | 14 | High | L |
| Components in wrong location | 25+ | High | L |
| Import/export violations | 50+ | Medium | M |
| React Hooks violations | 2 | Critical | M |
| TypeScript any violations | 50+ | Medium | M |

### Library (src/lib/) - 20% Compliant 🟡
| Issue Category | Count | Severity | Effort |
|----------------|-------|----------|--------|
| Module dependency violations | 5 | Critical | M |
| Missing test files | 15 | Critical | XL |
| Duplicate export conflicts | 2 | Critical | S |
| Missing JSDoc documentation | 12 | Medium | L |
| TypeScript any violations | 5 | Medium | M |
| Large file refactoring needed | 2 | Medium | XL |

---

## Priority Matrix & Dependencies

### 🔥 **Critical Path Items** (Blocks Everything)
**Priority**: P0 - IMMEDIATE  
**Dependency**: None (foundation items)

1. **Fix ESLint folder structure violations** 
   - Components: Flatten 9 folder structures → flat files
   - Pages: Flatten 13 folder structures → flat files
   - **Effort**: XL | **Impact**: Unblocks all development

2. **Fix TypeScript compilation errors**
   - Library: Resolve `formatDuration` duplicate export
   - **Effort**: S | **Impact**: Enables builds

3. **Fix React Hooks violations** 
   - Pages: Fix conditional hook usage in comparison components
   - **Effort**: M | **Impact**: Prevents runtime crashes

### 🚦 **High Priority Dependencies** (Enables Further Work)
**Priority**: P1 - URGENT  
**Dependency**: P0 completion

4. **Fix library module dependencies**
   - Extract React hooks from lib modules
   - Fix external import violations
   - **Effort**: M | **Impact**: Enables independent modules

5. **Create missing Storybook files**
   - 14 page stories + 4 component stories
   - **Effort**: L | **Impact**: Meets project requirements

6. **Relocate misplaced components**
   - Move 25+ page components to main components folder
   - Resolve naming conflicts
   - **Effort**: L | **Impact**: Enables proper component organization

### 🎯 **Medium Priority Infrastructure** (Quality & Testing)
**Priority**: P2 - HIGH  
**Dependency**: P0, P1 completion

7. **Fix import/export patterns**
   - Update atoms/index.ts exports
   - Update lib/index.ts exports  
   - Fix 75+ import violations across components/pages
   - **Effort**: M | **Impact**: Enables proper module architecture

8. **Create comprehensive test coverage**
   - 15 library test files (0% → 80%+ coverage)
   - Focus on critical calculation/parsing modules
   - **Effort**: XL | **Impact**: Ensures library reliability

### 📚 **Lower Priority Quality** (Polish & Maintenance)
**Priority**: P3 - MEDIUM  
**Dependency**: P0, P1, P2 completion

9. **Add comprehensive documentation**
   - JSDoc for 12 library modules
   - Complex algorithm documentation
   - **Effort**: L | **Impact**: Improves maintainability

10. **Remove TypeScript any violations**
    - 55+ any type replacements
    - **Effort**: M | **Impact**: Improves type safety

11. **Refactor complex modules**
    - Break down large files (scrimtime.ts, playerMetricsUtils.ts)
    - **Effort**: XL | **Impact**: Improves maintainability

---

## Implementation Phases

### 🚀 **Phase 1: Foundation (Critical Path)** 
**Duration**: 2-3 weeks | **Team**: 2-3 developers  
**Goal**: Unblock development and enable builds

#### Week 1: Structure Compliance
- [ ] Flatten all component folders (9 structures)
- [ ] Flatten all page folders (13 structures)  
- [ ] Fix duplicate export conflicts in library
- [ ] Fix React Hooks violations

#### Week 2: Core Dependencies  
- [ ] Extract React dependencies from library
- [ ] Fix module import violations
- [ ] Create all missing Storybook files (18 files)
- [ ] Basic smoke testing

#### Week 3: Component Organization
- [ ] Move misplaced components to correct locations
- [ ] Resolve component naming conflicts
- [ ] Update all internal component imports
- [ ] Validate ESLint passes

**Exit Criteria**: 
- ✅ All ESLint errors resolved
- ✅ TypeScript compilation succeeds
- ✅ All required files exist
- ✅ No runtime crashes

### 🔧 **Phase 2: Architecture (High Priority)**
**Duration**: 2-3 weeks | **Team**: 2-3 developers  
**Goal**: Establish proper module architecture and import patterns

#### Week 4: Import/Export Fixes
- [ ] Update atoms/index.ts with missing exports
- [ ] Update lib/index.ts with missing exports
- [ ] Fix component import violations (25+ files)
- [ ] Fix page import violations (50+ files)

#### Week 5: Testing Infrastructure  
- [ ] Create test files for critical library modules (5 files)
- [ ] Create test files for remaining library modules (10 files)
- [ ] Set up comprehensive test data and fixtures
- [ ] Achieve 60%+ library test coverage

#### Week 6: Integration Testing
- [ ] Validate all imports work correctly
- [ ] End-to-end testing of moved components
- [ ] Storybook comprehensive validation
- [ ] Performance impact assessment

**Exit Criteria**:
- ✅ All modules follow independent architecture
- ✅ Library has ≥60% test coverage
- ✅ All imports use index-only patterns
- ✅ Storybook builds all stories successfully

### 🎨 **Phase 3: Quality & Polish (Medium Priority)**
**Duration**: 2-3 weeks | **Team**: 1-2 developers  
**Goal**: Improve code quality, documentation, and maintainability

#### Week 7: Documentation
- [ ] Add JSDoc to all public library functions
- [ ] Document complex algorithms and data structures
- [ ] Create module-level documentation
- [ ] Update README and development guides

#### Week 8: Type Safety
- [ ] Replace any types in library modules
- [ ] Replace any types in component files  
- [ ] Replace any types in page files
- [ ] Improve type definitions and interfaces

#### Week 9: Refactoring & Optimization
- [ ] Break down large monolithic files
- [ ] Simplify over-engineered generic types
- [ ] Improve error handling patterns
- [ ] Final validation and cleanup

**Exit Criteria**:
- ✅ No any types in codebase
- ✅ All modules have comprehensive JSDoc
- ✅ All files follow consistent patterns
- ✅ Library achieves 80%+ test coverage

---

## Testing Strategy by Phase

### Phase 1 Testing: Smoke & Critical Path
**Focus**: Ensure basic functionality isn't broken during restructuring

**Testing Approach**:
- Manual smoke testing after each major move
- Automated ESLint validation 
- TypeScript compilation testing
- Basic Storybook rendering tests
- Critical user journey testing (file upload, basic viewing)

**Test Tools**:
- `./check-lint-build-errors.sh` continuous validation
- `npm test` for existing test suite
- `npm run storybook` for visual validation

### Phase 2 Testing: Architecture & Integration  
**Focus**: Validate new architecture works correctly

**Testing Approach**:
- Unit tests for all library modules (new test files)
- Integration tests for component → atom → library flow
- Comprehensive Storybook testing
- Import/export validation scripts
- Performance regression testing

**Test Tools**:
- Vitest for new unit tests
- Storybook Visual Tests for component validation
- Custom scripts for import validation
- Bundle analyzer for performance impact

### Phase 3 Testing: Quality & Regression
**Focus**: Ensure quality improvements don't introduce regressions

**Testing Approach**:
- Comprehensive test coverage analysis
- Documentation quality review
- Type safety validation
- End-to-end application testing
- Performance optimization validation

**Test Tools**:
- Coverage reports (aim for 80%+ library coverage)
- TypeScript strict mode validation
- Lighthouse performance audits
- Manual exploratory testing

---

## Risk Assessment & Mitigation

### 🔴 **High Risk Items**

#### Risk: Breaking Existing Functionality
**Probability**: High | **Impact**: Critical  
**Mitigation**: 
- Comprehensive backup strategy
- Incremental rollout with feature flags
- Extensive smoke testing between phases
- Maintain compatibility shims during transition

#### Risk: Import Chain Cascading Failures  
**Probability**: Medium | **Impact**: High  
**Mitigation**:
- Create dependency mapping before changes
- Use automated tools to update imports
- Validate each layer independently
- Rollback plan for each phase

#### Risk: Storybook Stories Breaking
**Probability**: Medium | **Impact**: Medium  
**Mitigation**:
- Export existing stories before moves
- Test story rendering after each component move
- Maintain story compatibility during transition
- Document story update patterns

### 🟡 **Medium Risk Items**

#### Risk: Performance Degradation
**Probability**: Low | **Impact**: Medium  
**Mitigation**:
- Baseline performance metrics before changes
- Monitor bundle size changes
- Performance testing in each phase
- Optimization in Phase 3 if needed

#### Risk: Team Coordination Issues  
**Probability**: Medium | **Impact**: Medium  
**Mitigation**:
- Clear communication of changes
- Documented migration guides for developers
- Coordination on branch merging
- Regular sync meetings during refactoring

---

## Success Metrics & Validation

### Phase 1 Success Metrics
- [ ] 0 ESLint folder-structure errors
- [ ] 0 TypeScript compilation errors  
- [ ] 0 React Hooks violations
- [ ] 18 new Storybook files created
- [ ] All existing functionality works

### Phase 2 Success Metrics  
- [ ] 0 independent-modules ESLint errors
- [ ] ≥60% library test coverage
- [ ] All imports use index-only patterns
- [ ] Storybook builds all stories
- [ ] No performance regressions >10%

### Phase 3 Success Metrics
- [ ] 0 TypeScript any violations
- [ ] ≥80% library test coverage
- [ ] 100% JSDoc coverage for public APIs
- [ ] All modules follow consistent patterns
- [ ] Performance improvements where possible

### Final Project Success Criteria
- [ ] **100% ESLint compliance** across all rules
- [ ] **100% TypeScript compilation** success
- [ ] **≥80% test coverage** for library modules
- [ ] **100% Storybook file coverage** for components/pages
- [ ] **0 any types** in production code
- [ ] **All modules independently architected**
- [ ] **Comprehensive documentation** for all public APIs

---

## Resource Requirements

### Team Composition
- **Lead Developer** (1): Architecture decisions, complex refactoring
- **Frontend Developers** (2): Component/page restructuring, testing  
- **QA Engineer** (0.5): Testing strategy, validation
- **Tech Writer** (0.25): Documentation updates

### Timeline Summary
- **Phase 1**: 2-3 weeks (Foundation)
- **Phase 2**: 2-3 weeks (Architecture)  
- **Phase 3**: 2-3 weeks (Quality)
- **Total**: 6-9 weeks depending on team size and complexity

### Tools & Infrastructure
- ESLint with project-structure plugin (already configured)
- Vitest for testing (already configured)
- Storybook for component development (already configured)
- Custom validation scripts for import checking
- Performance monitoring tools for regression detection

---

## Next Steps

1. **Immediate (This Week)**:
   - [ ] Review and approve this master plan with stakeholders
   - [ ] Assign team members to phases  
   - [ ] Set up project tracking (Jira/GitHub issues)
   - [ ] Create backup/rollback strategy

2. **Phase 1 Kickoff (Next Week)**:
   - [ ] Begin component folder flattening
   - [ ] Start TypeScript error fixes
   - [ ] Set up continuous validation pipeline

3. **Stakeholder Communication**:
   - [ ] Share timeline with dependent teams
   - [ ] Communicate breaking changes schedule
   - [ ] Plan feature freeze during critical phases

This master plan provides a structured, risk-managed approach to achieving full project compliance while maintaining functionality and team productivity.