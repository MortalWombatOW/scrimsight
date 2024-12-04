# TypeScript Graph

```bash
tsg --tsconfig=tsconfig.json --exclude node_modules --md=codebase-structure-graph.md
```

```mermaid
flowchart
    subgraph home/andrewgleeson/code/wombat//data//framework/dist["home/andrewgleeson/code/wombat-data-framework/dist"]
        home/andrewgleeson/code/wombat//data//framework/dist/DataUnits.d.ts["DataUnits.d.ts"]
        home/andrewgleeson/code/wombat//data//framework/dist/DataColumn.d.ts["DataColumn.d.ts"]
        home/andrewgleeson/code/wombat//data//framework/dist/Logger.d.ts["Logger.d.ts"]
        home/andrewgleeson/code/wombat//data//framework/dist/DataNode.d.ts["DataNode.d.ts"]
        home/andrewgleeson/code/wombat//data//framework/dist/DataManager.d.ts["DataManager.d.ts"]
        home/andrewgleeson/code/wombat//data//framework/dist/WombatDataContext.d.ts["WombatDataContext.d.ts"]
        home/andrewgleeson/code/wombat//data//framework/dist/index.d.ts["index.d.ts"]
        subgraph home/andrewgleeson/code/wombat//data//framework/dist/nodes["/nodes"]
            home/andrewgleeson/code/wombat//data//framework/dist/nodes/InputNode.d.ts["InputNode.d.ts"]
            home/andrewgleeson/code/wombat//data//framework/dist/nodes/ObjectStoreNode.d.ts["ObjectStoreNode.d.ts"]
            home/andrewgleeson/code/wombat//data//framework/dist/nodes/IndexedDBNode.d.ts["IndexedDBNode.d.ts"]
            home/andrewgleeson/code/wombat//data//framework/dist/nodes/AlaSQLNode.d.ts["AlaSQLNode.d.ts"]
            home/andrewgleeson/code/wombat//data//framework/dist/nodes/FunctionNode.d.ts["FunctionNode.d.ts"]
        end
        subgraph home/andrewgleeson/code/wombat//data//framework/dist/components["/components"]
            home/andrewgleeson/code/wombat//data//framework/dist/components/DataTable.d.ts["DataTable.d.ts"]
            subgraph home/andrewgleeson/code/wombat//data//framework/dist/components/QueriesPage["/QueriesPage"]
                home/andrewgleeson/code/wombat//data//framework/dist/components/QueriesPage/QueriesPage.d.ts["QueriesPage.d.ts"]
            end
        end
        subgraph home/andrewgleeson/code/wombat//data//framework/dist/hooks["/hooks"]
            home/andrewgleeson/code/wombat//data//framework/dist/hooks/useWombatDataNode.d.ts["useWombatDataNode.d.ts"]
            home/andrewgleeson/code/wombat//data//framework/dist/hooks/useWombatData.d.ts["useWombatData.d.ts"]
        end
    end
    subgraph src["src"]
        src/WombatDataFrameworkSchema.ts["WombatDataFrameworkSchema.ts"]
        src/routes.tsx["routes.tsx"]
        src/theme.ts["theme.ts"]
        src/App.tsx["App.tsx"]
        src/index.tsx["index.tsx"]
        src/mui//overrides.ts["mui_overrides.ts"]
        subgraph src/hooks["/hooks"]
            src/hooks/useMetrics.ts["useMetrics.ts"]
            src/hooks/useWindowSize.ts["useWindowSize.ts"]
            src/hooks/useDeepEffect.ts["useDeepEffect.ts"]
            src/hooks/useLegibleTextSvg.ts["useLegibleTextSvg.ts"]
            src/hooks/useMousePosition.ts["useMousePosition.ts"]
            src/hooks/useOutsideAlerter.ts["useOutsideAlerter.ts"]
            src/hooks/useScrollBlock.ts["useScrollBlock.ts"]
            src/hooks/useUniqueValuesForColumn.ts["useUniqueValuesForColumn.ts"]
        end
        subgraph src/components["/components"]
            subgraph src/components/Card["/Card"]
                src/components/Card/MetricCard.tsx["MetricCard.tsx"]
            end
            subgraph src/components/MapsList["/MapsList"]
                src/components/MapsList/MapsList.tsx["MapsList.tsx"]
            end
            subgraph src/components/PlayerList["/PlayerList"]
                src/components/PlayerList/PlayerList.tsx["PlayerList.tsx"]
            end
            subgraph src/components/Uploader["/Uploader"]
                src/components/Uploader/UploadProgressModal.tsx["UploadProgressModal.tsx"]
                src/components/Uploader/Uploader.tsx["Uploader.tsx"]
                src/components/Uploader/StatusIcon.tsx["StatusIcon.tsx"]
            end
            subgraph src/components/HomeDashboard["/HomeDashboard"]
                src/components/HomeDashboard/HomeDashboard.tsx["HomeDashboard.tsx"]
            end
            subgraph src/components/MapTimeline["/MapTimeline"]
                src/components/MapTimeline/MapTimeline.tsx["MapTimeline.tsx"]
                subgraph src/components/MapTimeline/types["/types"]
                    src/components/MapTimeline/types/timeline.types.ts["timeline.types.ts"]
                    src/components/MapTimeline/types/row.types.ts["row.types.ts"]
                end
                subgraph src/components/MapTimeline/hooks["/hooks"]
                    src/components/MapTimeline/hooks/useTimelineData.ts["useTimelineData.ts"]
                    src/components/MapTimeline/hooks/useTimelineDimensions.ts["useTimelineDimensions.ts"]
                    src/components/MapTimeline/hooks/useTimelineWindow.ts["useTimelineWindow.ts"]
                    src/components/MapTimeline/hooks/useHoverEvent.ts["useHoverEvent.ts"]
                end
                subgraph src/components/MapTimeline/components["/components"]
                    src/components/MapTimeline/components/TimelineErrorBoundary.tsx["TimelineErrorBoundary.tsx"]
                    src/components/MapTimeline/components/PixiWrapper.tsx["PixiWrapper.tsx"]
                    src/components/MapTimeline/components/TimelineGrid.tsx["TimelineGrid.tsx"]
                    src/components/MapTimeline/components/LabelArea.tsx["LabelArea.tsx"]
                    src/components/MapTimeline/components/Legend_Row.tsx["LegendRow.tsx"]
                    src/components/MapTimeline/components/PixiTimeline.tsx["PixiTimeline.tsx"]
                    src/components/MapTimeline/components/PixiTimelineRow.tsx["PixiTimelineRow.tsx"]
                    src/components/MapTimeline/components/PixiUltimateAdvantageChart.tsx["PixiUltimateAdvantageChart.tsx"]
                    src/components/MapTimeline/components/PixiXAxis.tsx["PixiXAxis.tsx"]
                    src/components/MapTimeline/components/TimelineContent.tsx["TimelineContent.tsx"]
                    src/components/MapTimeline/components/UltimateAdvantageChart.tsx["UltimateAdvantageChart.tsx"]
                    subgraph src/components/MapTimeline/components/rows["/rows"]
                        src/components/MapTimeline/components/rows/BaseTimelineRow.tsx["BaseTimelineRow.tsx"]
                        src/components/MapTimeline/components/rows/PlayerTimelineRow.tsx["PlayerTimelineRow.tsx"]
                        src/components/MapTimeline/components/rows/RoundTimelineRow.tsx["RoundTimelineRow.tsx"]
                        src/components/MapTimeline/components/rows/EventMapRow.tsx["EventMapRow.tsx"]
                        src/components/MapTimeline/components/rows/HeaderRow.tsx["HeaderRow.tsx"]
                        src/components/MapTimeline/components/rows/TimeLabelsRow.tsx["TimeLabelsRow.tsx"]
                        src/components/MapTimeline/components/rows/TeamAdvantageRow.tsx["TeamAdvantageRow.tsx"]
                        src/components/MapTimeline/components/rows/AliveAdvantageRow.tsx["AliveAdvantageRow.tsx"]
                        src/components/MapTimeline/components/rows/UltimateAdvantageRow.tsx["UltimateAdvantageRow.tsx"]
                    end
                end
                subgraph src/components/MapTimeline/constants["/constants"]
                    src/components/MapTimeline/constants/timeline.constants.tsx["timeline.constants.tsx"]
                end
                subgraph src/components/MapTimeline/utils["/utils"]
                    src/components/MapTimeline/utils/drawUtils.ts["drawUtils.ts"]
                    src/components/MapTimeline/utils/eventUtils.ts["eventUtils.ts"]
                    src/components/MapTimeline/utils/rend_erRow.tsx["renderRow.tsx"]
                end
                subgraph src/components/MapTimeline/context["/context"]
                    src/components/MapTimeline/context/TimelineContext.tsx["TimelineContext.tsx"]
                end
                subgraph src/components/MapTimeline/style_s["/styles"]
                    src/components/MapTimeline/style_s/timeline.style_s.ts["timeline.styles.ts"]
                end
            end
            subgraph src/components/Icons["/Icons"]
                src/components/Icons/GrimReaperIcon.tsx["GrimReaperIcon.tsx"]
                src/components/Icons/MacheteIcon.tsx["MacheteIcon.tsx"]
                src/components/Icons/UpCardIcon.tsx["UpCardIcon.tsx"]
                src/components/Icons/BeamsAuraIcon.tsx["BeamsAuraIcon.tsx"]
                src/components/Icons/GhostAllyIcon.tsx["GhostAllyIcon.tsx"]
                src/components/Icons/HealingIcon.tsx["HealingIcon.tsx"]
            end
            subgraph src/components/ChordDiagram["/ChordDiagram"]
                src/components/ChordDiagram/ChordDiagram.tsx["ChordDiagram.tsx"]
            end
            subgraph src/components/WombatDataWrapper["/WombatDataWrapper"]
                src/components/WombatDataWrapper/WombatDataWrapper.tsx["WombatDataWrapper.tsx"]
            end
            subgraph src/components/Debug["/Debug"]
                src/components/Debug/Debug.tsx["Debug.tsx"]
            end
            subgraph src/components/Common["/Common"]
                src/components/Common/IconAndText.tsx["IconAndText.tsx"]
                src/components/Common/RoleIcons.tsx["RoleIcons.tsx"]
            end
            subgraph src/components/WelcomeMessage["/WelcomeMessage"]
                src/components/WelcomeMessage/WelcomeMessage.tsx["WelcomeMessage.tsx"]
            end
        end
        subgraph src/lib["/lib"]
            src/lib/TeamAdvantageTracker.ts["TeamAdvantageTracker.ts"]
            src/lib/AdvantageTrackers.ts["AdvantageTrackers.ts"]
            src/lib/string.ts["string.ts"]
            src/lib/color.ts["color.ts"]
            src/lib/palette.ts["palette.ts"]
            src/lib/TsBase64.ts["TsBase64.ts"]
            src/lib/format.ts["format.ts"]
            src/lib/metrics.ts["metrics.ts"]
            subgraph src/lib/data["/data"]
                src/lib/data/types.ts["types.ts"]
                src/lib/data/uploadfile.ts["uploadfile.ts"]
                src/lib/data/hero.ts["hero.ts"]
            end
        end
        subgraph src/WombatUI["/WombatUI"]
            src/WombatUI/WombatUI.tsx["WombatUI.tsx"]
        end
        subgraph src/pages["/pages"]
            subgraph src/pages/Home["/Home"]
                src/pages/Home/Home.tsx["Home.tsx"]
            end
            subgraph src/pages/MapPage["/MapPage"]
                src/pages/MapPage/MapPage.tsx["MapPage.tsx"]
            end
            subgraph src/pages/Players["/Players"]
                src/pages/Players/PlayersPage.tsx["PlayersPage.tsx"]
            end
            subgraph src/pages/Player["/Player"]
                src/pages/Player/PlayerPage.tsx["PlayerPage.tsx"]
            end
            subgraph src/pages/Teams["/Teams"]
                src/pages/Teams/TeamsPage.tsx["TeamsPage.tsx"]
            end
            subgraph src/pages/Team["/Team"]
                src/pages/Team/TeamPage.tsx["TeamPage.tsx"]
            end
            subgraph src/pages/Metrics["/Metrics"]
                src/pages/Metrics/MetricsPage.tsx["MetricsPage.tsx"]
            end
            subgraph src/pages/SplashPage["/SplashPage"]
                src/pages/SplashPage/SplashRow.tsx["SplashRow.tsx"]
                src/pages/SplashPage/SplashPage.tsx["SplashPage.tsx"]
            end
        end
        subgraph src/services["/services"]
            src/services/dataManager.ts["dataManager.ts"]
        end
    end
    home/andrewgleeson/code/wombat//data//framework/dist/DataColumn.d.ts-->home/andrewgleeson/code/wombat//data//framework/dist/DataUnits.d.ts
    home/andrewgleeson/code/wombat//data//framework/dist/DataNode.d.ts-->home/andrewgleeson/code/wombat//data//framework/dist/DataColumn.d.ts
    home/andrewgleeson/code/wombat//data//framework/dist/DataNode.d.ts-->home/andrewgleeson/code/wombat//data//framework/dist/Logger.d.ts
    home/andrewgleeson/code/wombat//data//framework/dist/DataManager.d.ts-->home/andrewgleeson/code/wombat//data//framework/dist/DataColumn.d.ts
    home/andrewgleeson/code/wombat//data//framework/dist/DataManager.d.ts-->home/andrewgleeson/code/wombat//data//framework/dist/DataNode.d.ts
    home/andrewgleeson/code/wombat//data//framework/dist/DataManager.d.ts-->home/andrewgleeson/code/wombat//data//framework/dist/Logger.d.ts
    home/andrewgleeson/code/wombat//data//framework/dist/nodes/InputNode.d.ts-->home/andrewgleeson/code/wombat//data//framework/dist/DataColumn.d.ts
    home/andrewgleeson/code/wombat//data//framework/dist/nodes/InputNode.d.ts-->home/andrewgleeson/code/wombat//data//framework/dist/DataNode.d.ts
    home/andrewgleeson/code/wombat//data//framework/dist/nodes/InputNode.d.ts-->home/andrewgleeson/code/wombat//data//framework/dist/Logger.d.ts
    home/andrewgleeson/code/wombat//data//framework/dist/nodes/ObjectStoreNode.d.ts-->home/andrewgleeson/code/wombat//data//framework/dist/DataColumn.d.ts
    home/andrewgleeson/code/wombat//data//framework/dist/nodes/ObjectStoreNode.d.ts-->home/andrewgleeson/code/wombat//data//framework/dist/DataNode.d.ts
    home/andrewgleeson/code/wombat//data//framework/dist/nodes/ObjectStoreNode.d.ts-->home/andrewgleeson/code/wombat//data//framework/dist/Logger.d.ts
    home/andrewgleeson/code/wombat//data//framework/dist/nodes/IndexedDBNode.d.ts-->home/andrewgleeson/code/wombat//data//framework/dist/DataNode.d.ts
    home/andrewgleeson/code/wombat//data//framework/dist/nodes/IndexedDBNode.d.ts-->home/andrewgleeson/code/wombat//data//framework/dist/Logger.d.ts
    home/andrewgleeson/code/wombat//data//framework/dist/nodes/AlaSQLNode.d.ts-->home/andrewgleeson/code/wombat//data//framework/dist/DataColumn.d.ts
    home/andrewgleeson/code/wombat//data//framework/dist/nodes/AlaSQLNode.d.ts-->home/andrewgleeson/code/wombat//data//framework/dist/DataNode.d.ts
    home/andrewgleeson/code/wombat//data//framework/dist/nodes/AlaSQLNode.d.ts-->home/andrewgleeson/code/wombat//data//framework/dist/Logger.d.ts
    home/andrewgleeson/code/wombat//data//framework/dist/nodes/FunctionNode.d.ts-->home/andrewgleeson/code/wombat//data//framework/dist/DataColumn.d.ts
    home/andrewgleeson/code/wombat//data//framework/dist/nodes/FunctionNode.d.ts-->home/andrewgleeson/code/wombat//data//framework/dist/DataNode.d.ts
    home/andrewgleeson/code/wombat//data//framework/dist/nodes/FunctionNode.d.ts-->home/andrewgleeson/code/wombat//data//framework/dist/Logger.d.ts
    home/andrewgleeson/code/wombat//data//framework/dist/WombatDataContext.d.ts-->home/andrewgleeson/code/wombat//data//framework/dist/DataManager.d.ts
    home/andrewgleeson/code/wombat//data//framework/dist/WombatDataContext.d.ts-->home/andrewgleeson/code/wombat//data//framework/dist/Logger.d.ts
    home/andrewgleeson/code/wombat//data//framework/dist/components/DataTable.d.ts-->home/andrewgleeson/code/wombat//data//framework/dist/DataNode.d.ts
    home/andrewgleeson/code/wombat//data//framework/dist/hooks/useWombatDataNode.d.ts-->home/andrewgleeson/code/wombat//data//framework/dist/DataNode.d.ts
    home/andrewgleeson/code/wombat//data//framework/dist/hooks/useWombatData.d.ts-->home/andrewgleeson/code/wombat//data//framework/dist/DataNode.d.ts
    home/andrewgleeson/code/wombat//data//framework/dist/hooks/useWombatData.d.ts-->home/andrewgleeson/code/wombat//data//framework/dist/DataColumn.d.ts
    home/andrewgleeson/code/wombat//data//framework/dist/index.d.ts-->home/andrewgleeson/code/wombat//data//framework/dist/DataNode.d.ts
    home/andrewgleeson/code/wombat//data//framework/dist/index.d.ts-->home/andrewgleeson/code/wombat//data//framework/dist/DataManager.d.ts
    home/andrewgleeson/code/wombat//data//framework/dist/index.d.ts-->home/andrewgleeson/code/wombat//data//framework/dist/nodes/InputNode.d.ts
    home/andrewgleeson/code/wombat//data//framework/dist/index.d.ts-->home/andrewgleeson/code/wombat//data//framework/dist/nodes/ObjectStoreNode.d.ts
    home/andrewgleeson/code/wombat//data//framework/dist/index.d.ts-->home/andrewgleeson/code/wombat//data//framework/dist/nodes/IndexedDBNode.d.ts
    home/andrewgleeson/code/wombat//data//framework/dist/index.d.ts-->home/andrewgleeson/code/wombat//data//framework/dist/nodes/AlaSQLNode.d.ts
    home/andrewgleeson/code/wombat//data//framework/dist/index.d.ts-->home/andrewgleeson/code/wombat//data//framework/dist/nodes/FunctionNode.d.ts
    home/andrewgleeson/code/wombat//data//framework/dist/index.d.ts-->home/andrewgleeson/code/wombat//data//framework/dist/DataUnits.d.ts
    home/andrewgleeson/code/wombat//data//framework/dist/index.d.ts-->home/andrewgleeson/code/wombat//data//framework/dist/WombatDataContext.d.ts
    home/andrewgleeson/code/wombat//data//framework/dist/index.d.ts-->home/andrewgleeson/code/wombat//data//framework/dist/components/DataTable.d.ts
    home/andrewgleeson/code/wombat//data//framework/dist/index.d.ts-->home/andrewgleeson/code/wombat//data//framework/dist/components/QueriesPage/QueriesPage.d.ts
    home/andrewgleeson/code/wombat//data//framework/dist/index.d.ts-->home/andrewgleeson/code/wombat//data//framework/dist/hooks/useWombatDataNode.d.ts
    home/andrewgleeson/code/wombat//data//framework/dist/index.d.ts-->home/andrewgleeson/code/wombat//data//framework/dist/hooks/useWombatData.d.ts
    home/andrewgleeson/code/wombat//data//framework/dist/index.d.ts-->home/andrewgleeson/code/wombat//data//framework/dist/DataColumn.d.ts
    home/andrewgleeson/code/wombat//data//framework/dist/index.d.ts-->home/andrewgleeson/code/wombat//data//framework/dist/Logger.d.ts
    src/hooks/useMetrics.ts-->home/andrewgleeson/code/wombat//data//framework/dist/index.d.ts
    src/components/Card/MetricCard.tsx-->src/hooks/useMetrics.ts
    src/lib/AdvantageTrackers.ts-->src/lib/TeamAdvantageTracker.ts
    src/lib/data/uploadfile.ts-->src/lib/data/types.ts
    src/lib/data/uploadfile.ts-->src/lib/string.ts
    src/WombatDataFrameworkSchema.ts-->src/lib/AdvantageTrackers.ts
    src/WombatDataFrameworkSchema.ts-->src/lib/TeamAdvantageTracker.ts
    src/WombatDataFrameworkSchema.ts-->home/andrewgleeson/code/wombat//data//framework/dist/index.d.ts
    src/WombatDataFrameworkSchema.ts-->src/lib/data/uploadfile.ts
    src/components/MapsList/MapsList.tsx-->home/andrewgleeson/code/wombat//data//framework/dist/index.d.ts
    src/components/MapsList/MapsList.tsx-->src/WombatDataFrameworkSchema.ts
    src/components/MapsList/MapsList.tsx-->src/lib/string.ts
    src/components/PlayerList/PlayerList.tsx-->home/andrewgleeson/code/wombat//data//framework/dist/index.d.ts
    src/components/Uploader/Uploader.tsx-->src/components/Uploader/UploadProgressModal.tsx
    src/components/Uploader/Uploader.tsx-->home/andrewgleeson/code/wombat//data//framework/dist/index.d.ts
    src/components/Uploader/Uploader.tsx-->src/WombatUI/WombatUI.tsx
    src/components/HomeDashboard/HomeDashboard.tsx-->src/components/Card/MetricCard.tsx
    src/components/HomeDashboard/HomeDashboard.tsx-->src/components/MapsList/MapsList.tsx
    src/components/HomeDashboard/HomeDashboard.tsx-->src/components/PlayerList/PlayerList.tsx
    src/components/HomeDashboard/HomeDashboard.tsx-->src/components/Uploader/Uploader.tsx
    src/pages/Home/Home.tsx-->src/components/HomeDashboard/HomeDashboard.tsx
    src/components/MapTimeline/hooks/useTimelineData.ts-->home/andrewgleeson/code/wombat//data//framework/dist/index.d.ts
    src/components/MapTimeline/hooks/useTimelineData.ts-->src/components/MapTimeline/types/timeline.types.ts
    src/components/MapTimeline/types/row.types.ts-->src/components/MapTimeline/types/timeline.types.ts
    src/components/MapTimeline/constants/timeline.constants.tsx-->src/components/Icons/GrimReaperIcon.tsx
    src/components/MapTimeline/constants/timeline.constants.tsx-->src/components/Icons/MacheteIcon.tsx
    src/components/MapTimeline/constants/timeline.constants.tsx-->src/components/Icons/UpCardIcon.tsx
    src/components/MapTimeline/constants/timeline.constants.tsx-->src/components/Icons/BeamsAuraIcon.tsx
    src/components/MapTimeline/constants/timeline.constants.tsx-->src/components/Icons/GhostAllyIcon.tsx
    src/components/MapTimeline/components/LabelArea.tsx-->src/components/MapTimeline/constants/timeline.constants.tsx
    src/components/MapTimeline/components/rows/BaseTimelineRow.tsx-->src/components/MapTimeline/types/row.types.ts
    src/components/MapTimeline/components/rows/BaseTimelineRow.tsx-->src/components/MapTimeline/components/TimelineGrid.tsx
    src/components/MapTimeline/components/rows/BaseTimelineRow.tsx-->src/components/MapTimeline/components/LabelArea.tsx
    src/components/MapTimeline/utils/drawUtils.ts-->src/components/MapTimeline/constants/timeline.constants.tsx
    src/components/MapTimeline/utils/drawUtils.ts-->src/components/MapTimeline/types/timeline.types.ts
    src/components/MapTimeline/utils/eventUtils.ts-->src/components/MapTimeline/types/timeline.types.ts
    src/components/MapTimeline/components/rows/PlayerTimelineRow.tsx-->src/components/MapTimeline/types/row.types.ts
    src/components/MapTimeline/components/rows/PlayerTimelineRow.tsx-->src/components/MapTimeline/components/rows/BaseTimelineRow.tsx
    src/components/MapTimeline/components/rows/PlayerTimelineRow.tsx-->src/components/MapTimeline/utils/drawUtils.ts
    src/components/MapTimeline/components/rows/PlayerTimelineRow.tsx-->src/components/MapTimeline/utils/eventUtils.ts
    src/components/MapTimeline/components/rows/PlayerTimelineRow.tsx-->src/components/MapTimeline/constants/timeline.constants.tsx
    src/components/MapTimeline/components/rows/RoundTimelineRow.tsx-->src/components/MapTimeline/types/row.types.ts
    src/components/MapTimeline/components/rows/RoundTimelineRow.tsx-->src/components/MapTimeline/components/rows/BaseTimelineRow.tsx
    src/components/MapTimeline/components/rows/RoundTimelineRow.tsx-->src/components/MapTimeline/constants/timeline.constants.tsx
    src/components/MapTimeline/components/rows/EventMapRow.tsx-->src/components/MapTimeline/types/row.types.ts
    src/components/MapTimeline/components/rows/EventMapRow.tsx-->src/components/MapTimeline/components/rows/BaseTimelineRow.tsx
    src/components/MapTimeline/components/rows/HeaderRow.tsx-->src/components/MapTimeline/types/row.types.ts
    src/components/MapTimeline/components/rows/HeaderRow.tsx-->src/components/MapTimeline/components/rows/BaseTimelineRow.tsx
    src/components/MapTimeline/components/rows/HeaderRow.tsx-->src/components/MapTimeline/constants/timeline.constants.tsx
    src/components/MapTimeline/components/rows/TimeLabelsRow.tsx-->src/components/MapTimeline/components/rows/BaseTimelineRow.tsx
    src/components/MapTimeline/components/rows/TimeLabelsRow.tsx-->src/components/MapTimeline/types/row.types.ts
    src/components/MapTimeline/components/rows/TeamAdvantageRow.tsx-->src/components/MapTimeline/types/row.types.ts
    src/components/MapTimeline/components/rows/TeamAdvantageRow.tsx-->src/components/MapTimeline/components/rows/BaseTimelineRow.tsx
    src/components/MapTimeline/MapTimeline.tsx-->src/components/MapTimeline/hooks/useTimelineData.ts
    src/components/MapTimeline/MapTimeline.tsx-->src/components/MapTimeline/hooks/useTimelineDimensions.ts
    src/components/MapTimeline/MapTimeline.tsx-->src/components/MapTimeline/types/timeline.types.ts
    src/components/MapTimeline/MapTimeline.tsx-->src/components/MapTimeline/components/TimelineErrorBoundary.tsx
    src/components/MapTimeline/MapTimeline.tsx-->src/components/MapTimeline/components/PixiWrapper.tsx
    src/components/MapTimeline/MapTimeline.tsx-->src/components/MapTimeline/hooks/useTimelineWindow.ts
    src/components/MapTimeline/MapTimeline.tsx-->src/components/MapTimeline/types/row.types.ts
    src/components/MapTimeline/MapTimeline.tsx-->src/components/MapTimeline/components/rows/PlayerTimelineRow.tsx
    src/components/MapTimeline/MapTimeline.tsx-->src/components/MapTimeline/components/rows/RoundTimelineRow.tsx
    src/components/MapTimeline/MapTimeline.tsx-->src/components/MapTimeline/components/rows/EventMapRow.tsx
    src/components/MapTimeline/MapTimeline.tsx-->src/components/MapTimeline/components/rows/HeaderRow.tsx
    src/components/MapTimeline/MapTimeline.tsx-->src/components/MapTimeline/components/rows/TimeLabelsRow.tsx
    src/components/MapTimeline/MapTimeline.tsx-->src/components/MapTimeline/components/rows/TeamAdvantageRow.tsx
    src/lib/color.ts-->src/lib/data/types.ts
    src/components/ChordDiagram/ChordDiagram.tsx-->home/andrewgleeson/code/wombat//data//framework/dist/index.d.ts
    src/components/ChordDiagram/ChordDiagram.tsx-->src/lib/color.ts
    src/components/ChordDiagram/ChordDiagram.tsx-->src/WombatDataFrameworkSchema.ts
    src/components/ChordDiagram/ChordDiagram.tsx-->src/hooks/useWindowSize.ts
    src/components/ChordDiagram/ChordDiagram.tsx-->src/WombatUI/WombatUI.tsx
    src/components/ChordDiagram/ChordDiagram.tsx-->src/components/MapTimeline/types/timeline.types.ts
    src/pages/MapPage/MapPage.tsx-->src/components/MapTimeline/MapTimeline.tsx
    src/pages/MapPage/MapPage.tsx-->src/components/ChordDiagram/ChordDiagram.tsx
    src/pages/MapPage/MapPage.tsx-->src/WombatUI/WombatUI.tsx
    src/pages/MapPage/MapPage.tsx-->src/lib/string.ts
    src/pages/MapPage/MapPage.tsx-->src/WombatDataFrameworkSchema.ts
    src/pages/MapPage/MapPage.tsx-->home/andrewgleeson/code/wombat//data//framework/dist/index.d.ts
    src/routes.tsx-->src/pages/Home/Home.tsx
    src/routes.tsx-->src/pages/MapPage/MapPage.tsx
    src/routes.tsx-->src/pages/Players/PlayersPage.tsx
    src/routes.tsx-->src/pages/Player/PlayerPage.tsx
    src/routes.tsx-->src/pages/Teams/TeamsPage.tsx
    src/routes.tsx-->src/pages/Team/TeamPage.tsx
    src/routes.tsx-->src/pages/Metrics/MetricsPage.tsx
    src/routes.tsx-->home/andrewgleeson/code/wombat//data//framework/dist/index.d.ts
    src/theme.ts-->src/lib/palette.ts
    src/theme.ts-->src/lib/color.ts
    src/services/dataManager.ts-->home/andrewgleeson/code/wombat//data//framework/dist/index.d.ts
    src/services/dataManager.ts-->src/WombatDataFrameworkSchema.ts
    src/components/WombatDataWrapper/WombatDataWrapper.tsx-->home/andrewgleeson/code/wombat//data//framework/dist/index.d.ts
    src/components/WombatDataWrapper/WombatDataWrapper.tsx-->src/services/dataManager.ts
    src/components/Debug/Debug.tsx-->home/andrewgleeson/code/wombat//data//framework/dist/index.d.ts
    src/App.tsx-->src/routes.tsx
    src/App.tsx-->src/theme.ts
    src/App.tsx-->src/lib/color.ts
    src/App.tsx-->src/lib/palette.ts
    src/App.tsx-->src/components/WombatDataWrapper/WombatDataWrapper.tsx
    src/App.tsx-->src/components/Debug/Debug.tsx
    src/index.tsx-->src/App.tsx
    src/components/Common/IconAndText.tsx-->src/theme.ts
    src/components/MapTimeline/components/PixiTimeline.tsx-->src/components/MapTimeline/types/timeline.types.ts
    src/components/MapTimeline/components/PixiTimeline.tsx-->src/components/MapTimeline/constants/timeline.constants.tsx
    src/components/MapTimeline/components/PixiTimelineRow.tsx-->src/components/MapTimeline/types/timeline.types.ts
    src/components/MapTimeline/components/PixiTimelineRow.tsx-->src/components/MapTimeline/constants/timeline.constants.tsx
    src/components/MapTimeline/components/PixiUltimateAdvantageChart.tsx-->src/components/MapTimeline/types/timeline.types.ts
    src/components/MapTimeline/components/PixiXAxis.tsx-->src/components/MapTimeline/types/timeline.types.ts
    src/components/MapTimeline/components/PixiXAxis.tsx-->src/components/MapTimeline/components/PixiUltimateAdvantageChart.tsx
    src/components/MapTimeline/components/rows/AliveAdvantageRow.tsx-->src/components/MapTimeline/types/row.types.ts
    src/components/MapTimeline/components/rows/AliveAdvantageRow.tsx-->src/components/MapTimeline/components/rows/BaseTimelineRow.tsx
    src/components/MapTimeline/components/rows/UltimateAdvantageRow.tsx-->src/components/MapTimeline/types/row.types.ts
    src/components/MapTimeline/components/rows/UltimateAdvantageRow.tsx-->src/components/MapTimeline/components/rows/BaseTimelineRow.tsx
    src/components/MapTimeline/hooks/useHoverEvent.ts-->src/components/MapTimeline/utils/eventUtils.ts
    src/components/MapTimeline/hooks/useHoverEvent.ts-->src/components/MapTimeline/types/timeline.types.ts
    src/components/MapTimeline/utils/rend_erRow.tsx-->src/components/MapTimeline/types/row.types.ts
    src/components/MapTimeline/utils/rend_erRow.tsx-->src/components/MapTimeline/components/rows/PlayerTimelineRow.tsx
    src/components/MapTimeline/utils/rend_erRow.tsx-->src/components/MapTimeline/components/rows/RoundTimelineRow.tsx
    src/components/MapTimeline/utils/rend_erRow.tsx-->src/components/MapTimeline/components/rows/UltimateAdvantageRow.tsx
    src/components/MapTimeline/utils/rend_erRow.tsx-->src/components/MapTimeline/components/rows/EventMapRow.tsx
    src/components/MapTimeline/utils/rend_erRow.tsx-->src/components/MapTimeline/components/rows/HeaderRow.tsx
    src/components/MapTimeline/utils/rend_erRow.tsx-->src/components/MapTimeline/components/rows/TimeLabelsRow.tsx
    src/components/MapTimeline/utils/rend_erRow.tsx-->src/components/MapTimeline/types/timeline.types.ts
    src/hooks/useLegibleTextSvg.ts-->src/hooks/useDeepEffect.ts
    src/hooks/useMousePosition.ts-->src/hooks/useDeepEffect.ts
    src/hooks/useOutsideAlerter.ts-->src/hooks/useDeepEffect.ts
    src/hooks/useUniqueValuesForColumn.ts-->home/andrewgleeson/code/wombat//data//framework/dist/index.d.ts
    src/pages/SplashPage/SplashPage.tsx-->src/pages/SplashPage/SplashRow.tsx
```
