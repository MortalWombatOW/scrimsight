# 10 - Design Patterns: General Principles

## General Approach

- **Understand the Problem:** Before applying a pattern, clearly understand the problem you're trying to solve.  Don't apply patterns just for the sake of it.
- **Favor Composition over Inheritance:**  When extending functionality, prefer composition (has-a relationship) over inheritance (is-a relationship).  This promotes flexibility and reduces tight coupling.
- **Program to an Interface:** Depend on abstractions (interfaces or abstract classes), not concrete implementations.  This makes it easier to change implementations without affecting dependent code.
- **Encapsulate What Varies:** Identify parts of your code that are likely to change and isolate them. This minimizes the impact of changes.
- **Single Responsibility Principle (SRP):**  Each class (and component) should have one, and only one, reason to change.  This promotes modularity and maintainability.
- **Open/Closed Principle (OCP):**  Classes should be open for extension but closed for modification.  Add new functionality by extending existing classes (or using composition), not by modifying them directly.
- **Liskov Substitution Principle (LSP):**  Subtypes must be substitutable for their base types without altering the correctness of the program.  This is crucial for inheritance and polymorphism.
- **Interface Segregation Principle (ISP):**  Clients should not be forced to depend on methods they don't use.  Create smaller, more specific interfaces.
- **Dependency Inversion Principle (DIP):**  High-level modules should not depend on low-level modules.  Both should depend on abstractions.  Abstractions should not depend on details; details should depend on abstractions.

## Refactoring

- **Refactor Regularly:**  Continuously look for opportunities to improve code quality and reduce technical debt.
- **Refactoring to Patterns:** Consider refactoring existing code *towards* design patterns when appropriate.  This can improve flexibility, maintainability, and understandability.
- **Document Patterns:** When a design pattern is used, clearly document it, explaining the reasoning behind the choice.
- **Avoid Over-Engineering:** Don't apply patterns prematurely.  Start simple and add complexity only when needed.