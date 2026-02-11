"""
Consistent visualization styling for the Overwatch analysis.

Uses an Overwatch-inspired color palette with seaborn defaults.
"""

import matplotlib.pyplot as plt
import matplotlib as mpl
import seaborn as sns

# Overwatch-inspired palette
OW_COLORS = {
    "orange": "#F99E1A",
    "blue": "#3A7BDB",
    "dark_blue": "#1B2838",
    "light_gray": "#C4C4C4",
    "white": "#FFFFFF",
    "red": "#E03C31",
    "green": "#4CAF50",
    "gold": "#FFD700",
    "teal": "#00BCD4",
    "purple": "#9C27B0",
}

# Role colors
ROLE_COLORS = {
    "Tank": "#3A7BDB",
    "DPS": "#E03C31",
    "Support": "#4CAF50",
}

OW_PALETTE = [
    OW_COLORS["orange"], OW_COLORS["blue"], OW_COLORS["red"],
    OW_COLORS["green"], OW_COLORS["teal"], OW_COLORS["purple"],
    OW_COLORS["gold"], OW_COLORS["light_gray"],
]


def setup_style():
    """Apply consistent Overwatch-themed plot styling."""
    sns.set_theme(style="darkgrid", palette=OW_PALETTE)
    mpl.rcParams.update({
        "figure.figsize": (12, 6),
        "figure.dpi": 100,
        "figure.facecolor": "#1B2838",
        "axes.facecolor": "#1E3A5F",
        "axes.edgecolor": "#C4C4C4",
        "axes.labelcolor": "#FFFFFF",
        "text.color": "#FFFFFF",
        "xtick.color": "#C4C4C4",
        "ytick.color": "#C4C4C4",
        "grid.color": "#2A4A6B",
        "grid.alpha": 0.5,
        "font.size": 12,
        "axes.titlesize": 16,
        "axes.labelsize": 13,
        "legend.facecolor": "#1B2838",
        "legend.edgecolor": "#C4C4C4",
        "legend.labelcolor": "#FFFFFF",
    })


def save_fig(fig, name: str, output_dir: str = "outputs/figures"):
    """Save figure with tight layout."""
    import os
    os.makedirs(output_dir, exist_ok=True)
    fig.savefig(
        os.path.join(output_dir, f"{name}.png"),
        bbox_inches="tight",
        facecolor=fig.get_facecolor(),
        dpi=150,
    )
    plt.close(fig)


def role_color(role: str) -> str:
    """Get color for a role."""
    return ROLE_COLORS.get(role, OW_COLORS["light_gray"])
