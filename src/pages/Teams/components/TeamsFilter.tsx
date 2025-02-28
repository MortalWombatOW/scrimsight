export type SortOption = "name" | "wins" | "recent" | "players";

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
    <div className="rounded-lg bg-white p-4 shadow-md mb-6 dark:bg-gray-800">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Search Teams
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Enter team name..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Sort By
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
          >
            <option value="name">Team Name</option>
            <option value="wins">Most Wins</option>
            <option value="recent">Most Recent</option>
            <option value="players">Most Players</option>
          </select>
        </div>
      </div>
    </div>
  );
};
