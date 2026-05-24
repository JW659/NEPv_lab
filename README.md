# NEPv Interactive Exploration Laboratory

An interactive, browser-based visualization tool designed to explore the Eigenvector-Dependent Nonlinear Eigenvalue Problem (NEPv) in the context of rabbit population dynamics. 

## 🚀 Getting Started

This project is built with Vanilla Web Technologies (HTML, CSS, JavaScript) and requires **zero build tools or dependencies** to run. 

### 1. Clone the Repository
Open your terminal and run:
```bash
git clone [https://github.com/](https://github.com/)[your-username]/[repo-name].git
cd [repo-name]
```
### 2. Install
Because this is a zero-dependency project, there is no need to run npm install or configure any package managers.

### 3. Run locally
To ensure all Canvas drawing operations and external CDN scripts execute properly, running a local server is recommended.
In your terminal go to the cloned folder and run command 'python -m http.server 8000'
If you have python installed, you can start a server instantly
Then, open your browser and navigate to: http://localhost:8000

Or you can just go to your cloned folder and double-click on the index.html file directly

### 4. Design choices

* Simple Architecture: Opted for pure HTML, CSS, and Vanilla JavaScript. 

* UI/UX Layer: CSS Variables are used for a maintainable, aesthetic UI

* Mathematical Rendering: Used MathJax to ensure rendering of LaTeX formulas dynamically in the browser.

### 5. Limitations and future work
* Only models a 2D toy model. Can't really demonstrate the power of NEPv in many applications. 
* The visualization focuses mainly focuses on  abstract math, may not be helpful to building intuition about the examples.

Should come up with cooler 3D examples to better demonstrate the idea. 