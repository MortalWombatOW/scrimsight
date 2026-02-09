// Remove "recent" from sort options
export type SortOption = "name" | "wins" | "players";

interface TeamsFilterProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  sortBy: SortOption;
  onSortChange: (value: SortOption) => void;
}

export const TeamsFilter = ({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
}: TeamsFilterProps) => {
  return (
    <div className="rounded-lg bg-base-100 p-4 shadow-md mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        <div>
          <label className="block text-sm font-medium text-base-content/80 mb-1">
            Search Teams
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-base-content/10 bg-base-200 rounded-md shadow-sm focus:outline-none focus:ring-primary/30 focus:border-primary"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Enter team name..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-base-content/80 mb-1">
            Sort By
          </label>
          <select
            className="w-full px-3 py-2 border border-base-content/10 bg-base-200 rounded-md shadow-sm focus:outline-none focus:ring-primary/30 focus:border-primary"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
          >
            <option value="name">Team Name</option>
            {/* Update label to reflect sorting by win rate */}
            <option value="wins">Highest Win Rate</option>
            {/* Removed "Most Recent" option */}
            <option value="players">Most Players</option>
          </select>
        </div>
      </div>
    </div>
  );
};
