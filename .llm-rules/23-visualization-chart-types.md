# 23 - Visualization: Choosing the Right Chart Type

## Core Principles

- **Match Chart to Data and Purpose:** The choice of chart type MUST be driven by the type of data being displayed and the question the visualization is intended to answer.

## Chart Type Guidelines

- **Line Charts:**
    - **Use For:** Tracking changes or trends over time (time series data). Showing relationships between two or more *continuous* variables.
    - **Avoid For:**  Comparing discrete categories (use bar charts instead). Displaying data with no inherent order.
    - **Example (Scrimsight):**  Win rate over time, average damage per game over time.

- **Bar Charts (and Column Charts):**
    - **Use For:** Comparing quantities of different *discrete* categories.  Horizontal bar charts are often better for long category labels.
    - **Avoid For:**  Showing trends over time (use line charts instead).  Displaying too many categories (becomes cluttered).
    - **Example (Scrimsight):**  Comparing win rates across different maps, comparing average damage for different heroes.

- **Scatter Plots:**
    - **Use For:** Showing the correlation (relationship) between *two* continuous variables.  Identifying clusters, outliers, and patterns.
    - **Avoid For:**  Showing trends over time (unless time is one of the two variables).  Comparing discrete categories.
    - **Example (Scrimsight):**  Relationship between damage dealt and healing received, relationship between eliminations and deaths.

- **Bubble Charts:**
    - **Use For:**  Similar to scatter plots, but with a *third* dimension represented by the size of the bubble.  Showing the relationship between *three* continuous variables.
    - **Avoid For:**  Precise comparisons of bubble sizes (humans are bad at judging relative areas).  Too many bubbles (becomes cluttered).
    - **Example (Scrimsight):**  Relationship between damage, healing, and win rate (win rate represented by bubble size).

- **Treemaps:**
    - **Use For:**  Displaying hierarchical data and comparing proportions between categories using area.  Space-efficient for large datasets.
    - **Avoid For:**  Precise comparisons of sizes (especially for similar-sized categories).  Showing trends over time.
    - **Example (Scrimsight):**  Could be used to show the proportion of playtime for each hero, grouped by role (Tank, Damage, Support). *Potentially* useful, but other charts might be better.

- **Avoid Pie Charts (Generally):**
    - **Rationale:** Humans are bad at comparing angles and areas.  Pie charts are often misused and can be misleading.
    - **Limited Use Cases:**  Only consider pie charts for showing parts of a whole with a *very small* number of categories (ideally 2-3, *absolutely no more than 5*).
    - **Alternatives:**  Bar charts, stacked bar charts, or donut charts are almost always better alternatives.
    - **Example (Scrimsight):**  *Almost certainly* should not be used.  There are very few situations where a pie chart would be the best choice.

- **Donut Charts (Use with Caution):**
    - **Use For:**  Similar to pie charts (parts of a whole), but slightly easier to read (focus on arc length rather than angle). Still, use sparingly.
    - **Avoid For:**  More than a few categories. Precise comparisons.
    - **Example (Scrimsight):** *Potentially* for showing the proportion of games played on different game modes (e.g., Control, Push, Hybrid), but a bar chart is likely better.

- **Tables:**
    - **Use For:** Displaying precise values.  When users need to look up specific data points.  When comparing data across multiple dimensions.
    - **Avoid For:**  Showing trends or patterns (use charts instead).  Large, unwieldy tables without sorting/filtering options.
    - **Example (Scrimsight):** Displaying detailed player statistics, match history.

- **Heatmaps (Tables):**
     - **Use For:** Highlighting high and low values within a table.
     - **Avoid For:** Replacing a chart that shows trends.
     - **Example (Scrimsight):** Win rates per map per hero.
