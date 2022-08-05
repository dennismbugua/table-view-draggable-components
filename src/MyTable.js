import React from "react";
import MaterialTable, { MTableHeader } from "material-table";
import ExportCSV, { objToString } from "./ExportCSV.js";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import { forwardRef } from "react";

import AddBox from "@material-ui/icons/AddBox";
import ArrowUpward from "@material-ui/icons/ArrowUpward";
import Check from "@material-ui/icons/Check";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import Clear from "@material-ui/icons/Clear";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import Edit from "@material-ui/icons/Edit";
import FilterList from "@material-ui/icons/FilterList";
import FirstPage from "@material-ui/icons/FirstPage";
import LastPage from "@material-ui/icons/LastPage";
import Remove from "@material-ui/icons/Remove";
import SaveAlt from "@material-ui/icons/SaveAlt";
import Search from "@material-ui/icons/Search";
import ViewColumn from "@material-ui/icons/ViewColumn";

const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => (
    <ChevronRight {...props} ref={ref} />
  )),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => (
    <ChevronLeft {...props} ref={ref} />
  )),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowUpward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};

const grid = 4;

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: grid * 2,
  margin: `0 ${grid}px 0 0`,

  // change background colour if dragging
  background: isDragging ? "lightgreen" : "grey",

  // styles we need to apply on draggables
  ...draggableStyle
});

const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
  //display: "flex",
  padding: grid,
  overflow: "auto"
});

export default class MyTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tableHeight: document.getElementById("content").clientHeight - 200,
      columnPositions: [0, 1, 2, 3],
      columns: [
        {
          title: "Name",
          field: "name",
          order: "desc",
          tableData: { columnOrder: 0, id: 0 }
        },
        {
          title: "Surname",
          field: "surname",
          order: "desc",
          tableData: { columnOrder: 1, id: 1 }
        },
        {
          title: "Birth Year",
          field: "birthYear",
          order: "asc",
          type: "numeric",
          tableData: { columnOrder: 2, id: 2 }
        },
        {
          title: "Birth Place",
          field: "birthCity",
          order: "asc",
          lookup: { 1: "N", 2: "M" },
          tableData: { columnOrder: 3, id: 3 }
        }
      ],
      data: [
        { name: "Aa", surname: "Zx", birthYear: 2000, birthCity: 2 },
        { name: "Bb", surname: "Zx", birthYear: 2001, birthCity: 1 },
        { name: "Cc", surname: "Zx", birthYear: 2000, birthCity: 2 },
        { name: "Dd", surname: "Zx", birthYear: 2003, birthCity: 1 },
        { name: "Ee", surname: "Zx", birthYear: 2001, birthCity: 2 },
        { name: "Ff", surname: "Zx", birthYear: 2000, birthCity: 1 }
      ]
    };
    this.onDragEnd = this.onDragEnd.bind(this);
  }
  updateDimensions = () => {
    var newHeight = document.getElementById("content").clientHeight - 200;
    if (this.state.tableHeight !== newHeight) {
      this.setState({
        tableHeight: newHeight
      });
    }
  };
  componentDidMount() {
    window.addEventListener("resize", this.updateDimensions);
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
  }
  onDragEnd(result) {
    if (!result.destination) {
      return;
    }

    var srcId = Number(result.source.index);
    var dstId = Number(result.destination.index);

    console.log(srcId + " => " + dstId);

    var _columnPositions = this.state.columnPositions.slice(0);
    var sId = _columnPositions[srcId];
    var dId = _columnPositions[dstId];
    _columnPositions[srcId] = dId;
    _columnPositions[dstId] = sId;
    console.log(_columnPositions);
    this.setState({ columnPositions: _columnPositions });
  }
  render() {
    var _columns = [];
    for (var c in this.state.columnPositions) {
      var cc = this.state.columnPositions[c];
      var col = this.state.columns[cc];
      col.tableData.columnOrder = c;
      col.tableData.id = c;
      _columns.push(col);
    }
    return (
      <MaterialTable
        title="Basic Grouping Preview"
        icons={tableIcons}
        columns={_columns}
        data={this.state.data}
        options={{
          grouping: true,
          sorting: true,
          minBodyHeight: this.state.tableHeight,
          maxBodyHeight: this.state.tableHeight,
          emptyRowsWhenPaging: false,
          pageSize: 10,
          pageSizeOptions: [5, 10, 15],
          exportButton: true,
          exportAllData: true,
          exportCsv: (columns, data) => {
            ExportCSV("data.csv", columns, data);
          }
        }}
        onColumnDragged={(sourceIndex, destinationIndex) => {
          var _columnPositions = this.state.columnPositions.slice(0);
          var sId = _columnPositions[sourceIndex];
          var dId = _columnPositions[destinationIndex];
          _columnPositions[sourceIndex] = dId;
          _columnPositions[destinationIndex] = sId;
          this.setState({ columnPositions: _columnPositions });
        }}
        components={{
          Header: (props) => {
            console.log(JSON.stringify(props));
            return (
              <DragDropContext onDragEnd={this.onDragEnd}>
                <Droppable droppableId="droppable" direction="horizontal">
                  {(provided, snapshot) => (
                    <tr
                      ref={provided.innerRef}
                      style={getListStyle(snapshot.isDraggingOver)}
                      {...provided.droppableProps}
                    >
                      {props.columns.map((column, index) => (
                        <Draggable
                          key={"draggable-" + column.tableData.columnOrder}
                          draggableId={
                            "draggable-" + column.tableData.columnOrder
                          }
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <th
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={getItemStyle(
                                snapshot.isDragging,
                                provided.draggableProps.style
                              )}
                            >
                              {column.title} {column.order}
                            </th>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </tr>
                  )}
                </Droppable>
              </DragDropContext>
            );
          }
        }}
      />
    );
  }
}
