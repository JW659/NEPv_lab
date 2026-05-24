# Project Report
## Problem Statement
* Build own understanding of NEPv  problems and demonstrate understanding through  simple examples. Help user comprehend this model and problems it can solve.
* Through interaction and visualization, make abstract math ideas (like eigenvectors and SCF algorithm) more intuitive and easier to understand.
## Basic Idea


1. **Start with simple SEP:** Review the classic 2D Fibonacci rabbit model to establish a baseline understanding of matrices and eigenvectors.
2. **Introduce the Constraint (NEPv):** Based on the SEP model, upgrade the model with a realistic physical constraint (x,y the proportion of adults and babies, x+y=1). As adult rabbits consume more resources, the growth matrix dynamically changes.
3. **Solve Visually:** Instead of forcing complex algebra, introduce the Self-Consistent Field (SCF) algorithm. Users click through iterations to watch the system naturally find its stable ratio (eigenvector) and growth rate (eigenvalue).
4. **Real-World Frontier:** Explain how this "toy model" directly scales to solve advanced problems like quantum mechanics (Kohn-Sham equations) and dynamic data clustering.
## Methodology
### 1. SEP part: 

***Problem formulation and UI design:***

For the SEP section, the UI is split into two parts: mathematical context on the left, and a 3Blue1Brown-inspired interactive canvas on the right.

Instead of asking users to calculate eigenvectors manually, they drag a vector to observe how the matrix transforms the space. They visually "find" the eigenvector by locating the exact angle **where the vector only stretches, but does not rotate.**

 Once found, the tool provides the analytical solution (Binet's formula) to calculate exact future populations.
 ***
 ***Insight:***

 Because the rules are fixed, the system is fully transparent. If you find the eigenvector, you can use a formula to instantly predict the exact state of the system at any point in the future.
 ***
 ### 2. NEPv part:
 
 ***Problem formulation:***

 When designing the NEPv model, I initially focused only on making the transition matrix change based on the input vector. However, during validation, I realized: without a strict constraint, any eigenvalue $\lambda$ within a certain range could satisfy the equation, making the results mathematically meaningless.

 I realized that a NEPv model requires a physical constraint based on the model. I realized the constraint I can introduce in population dynamics (the rabbit scenario) is the proportion of adults ($x$) and juveniles ($y$) must always equal 100%. Bounding the system to the line $x + y = 1$ instantly gave the model meaning and a unique, solvable target.
***
 While a 2D rabbit model can be solved using basic analytical algebra, that approach completely breaks down when scaled to real-world systems with higher dimensions (more age groups) or higher-power equations.

To bridge this gap, numerical algorithm Self-Consistent Field (SCF) iteration method  is often used to solve complex, multi-dimensional nonlinear equations by iteratively updating guesses until they converge. 

So I chose to design an user interface that can demonstrate the characteristics of the NEPv model and demonstrate how to solve it numerically.

***Visualization:***

The Level 2 user interface is explicitly split into two interactive experiments:

Interaction 1: Visualizing Constraints and Chaos. Users drag a vector and see that it is physically locked to the $x + y = 1$ line. As they slide it, they see the space (the environment matrix) change in real-time, making the eigenvectors shift unpredictably. This perfectly demonstrates why finding the equilibrium manually is so difficult.

Interaction 2: Step-by-Step SCF Simulation. Users choose a penalty factor ($\alpha$), start with a generic "blind guess" vector of $\begin{bmatrix} 0.5 \\ 0.5 \end{bmatrix}$, and click to run the SCF steps. The application shows how the algorithm freezes the matrix, calculates the temporary linear eigenvector, projects it back to the constraint line, and steadily hunts down the self-consistent equilibrium.
***
### 3.Real-World Application part
To show how this "toy rabbit model" scales to cutting-edge science, the final section provides an overview of two massive fields driven by NEPv:

Quantum Chemistry (The Kohn-Sham Equations) 

Data Science & Machine Learning (Dynamic Graph Clustering)

Due to the abstract settings and extreme mathematical dimensionality, these frontier applications are hard to comprehend let alone visualize to demonstrate understanding.

## Evaluation methods
Use eigenvector calculator to verify the interaction blocks, and SCF process. 

Under different $\alpha$, calculate the SCF process with eigenvector calculators, make sure the calculatiuon functions are correct.
## Experimental results
The 5 instances tested all ruesulted in correct numbers. It's safe to say the functions implemented are correct.