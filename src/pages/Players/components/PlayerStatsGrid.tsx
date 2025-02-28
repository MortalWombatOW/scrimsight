import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridToolbar,
} from "@mui/x-data-grid";
import { useAtomValue } from "jotai";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { playerStatsByPlayerAtom } from "../../../atoms/metrics/playerMetricsAtoms";
import { Search as SearchIcon } from "@mui/icons-material";

interface PlayerRow {
  id: number;
  playerName: string;
  eliminations: number;
  deaths: number;
  heroDamageDealt: number;
  healingDealt: number;
  ultimatesEarned: number;
  weaponAccuracy: number;
}

export const PlayerStatsGrid = () => {
  const playerStats = useAtomValue(playerStatsByPlayerAtom);
  const navigate = useNavigate();
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const columns: GridColDef<PlayerRow>[] = [
    {
      field: "playerName",
      headerName: "Player",
      flex: 1,
      minWidth: 150,
      renderCell: (params: GridRenderCellParams<PlayerRow>) => (
        <div
          className="cursor-pointer hover:underline relative group"
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            navigate(`/players/${encodeURIComponent(params.row.playerName)}`);
          }}
        >
          {params.row.playerName || "Unknown"}
          <div className="absolute left-0 bottom-full mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
            Click to view player details
          </div>
        </div>
      ),
    },
    { field: "playerRole", headerName: "Role", width: 120 },
    {
      field: "eliminations",
      headerName: "Eliminations",
      type: "number",
      width: 130,
      valueFormatter: (value: number) => value?.toLocaleString() ?? "0",
    },
    {
      field: "deaths",
      headerName: "Deaths",
      type: "number",
      width: 130,
      valueFormatter: (value: number) => value?.toLocaleString() ?? "0",
    },
    {
      field: "kdr",
      headerName: "K/D Ratio",
      type: "number",
      width: 130,
      valueGetter: (_, row: PlayerRow) => {
        const deaths = row.deaths || 1; // Avoid division by zero
        return row.eliminations / deaths;
      },
      valueFormatter: (value: number) => value?.toFixed(2) ?? "0.00",
    },
    {
      field: "heroDamageDealt",
      headerName: "Hero Damage",
      type: "number",
      width: 130,
      valueFormatter: (value: number) => value?.toLocaleString() ?? "0",
    },
    {
      field: "healingDealt",
      headerName: "Healing",
      type: "number",
      width: 130,
      valueFormatter: (value: number) => value?.toLocaleString() ?? "0",
    },
    {
      field: "ultimatesEarned",
      headerName: "Ultimates Earned",
      type: "number",
      width: 150,
      valueFormatter: (value: number) => value?.toLocaleString() ?? "0",
    },
    {
      field: "weaponAccuracy",
      headerName: "Accuracy",
      type: "number",
      width: 130,
      valueFormatter: (value: number) =>
        value != null ? `${(value * 100).toFixed(1)}%` : "0%",
    },
  ];

  const rows: PlayerRow[] =
    playerStats?.rows
      .filter((player) => {
        const matchesSearch = player.playerName
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        return matchesSearch;
      })
      .map((player, index: number) => ({
        id: index,
        playerName: player.playerName,
        eliminations: player.eliminations,
        deaths: player.deaths,
        heroDamageDealt: player.heroDamageDealt,
        healingDealt: player.healingDealt,
        ultimatesEarned: player.ultimatesEarned,
        weaponAccuracy: player.weaponAccuracy,
      })) || [];

  return (
    <div className="bg-white rounded-lg shadow-md p-4 h-[600px] w-full dark:bg-gray-800">
      <div className="flex flex-wrap gap-4 mb-4">
        <div className="w-full md:w-[200px]">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Role
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="all">All Roles</option>
            <option value="tank">Tank</option>
            <option value="damage">Damage</option>
            <option value="support">Support</option>
          </select>
        </div>
        <div className="w-full md:w-[300px]">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Search Players
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by player name..."
            />
          </div>
        </div>
      </div>

      <DataGrid<PlayerRow>
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
          sorting: {
            sortModel: [{ field: "eliminations", sort: "desc" }],
          },
        }}
        pageSizeOptions={[10, 25, 50]}
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 500 },
          },
        }}
        disableRowSelectionOnClick
        sx={{
          "& .MuiDataGrid-cell:hover": {
            color: "primary.main",
          },
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: "transparent",
          },
        }}
      />
    </div>
  );
};
