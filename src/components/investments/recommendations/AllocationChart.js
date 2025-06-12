"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var recharts_1 = require("recharts");
var AllocationChart = function (_a) {
    var allocation = _a.allocation;
    var RADIAN = Math.PI / 180;
    var renderCustomizedLabel = function (_a) {
        var cx = _a.cx, cy = _a.cy, midAngle = _a.midAngle, innerRadius = _a.innerRadius, outerRadius = _a.outerRadius, percent = _a.percent, index = _a.index;
        var radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        var x = cx + radius * Math.cos(-midAngle * RADIAN);
        var y = cy + radius * Math.sin(-midAngle * RADIAN);
        return percent * 100 > 5 ? (<text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central">
        {"".concat((percent * 100).toFixed(0), "%")}
      </text>) : null;
    };
    return (<div className="h-64 flex items-center justify-center">
      <recharts_1.ResponsiveContainer width="100%" height="100%">
        <recharts_1.PieChart>
          <recharts_1.Pie data={allocation} cx="50%" cy="50%" labelLine={false} label={renderCustomizedLabel} outerRadius={80} fill="#8884d8" dataKey="percentage">
            {allocation.map(function (entry, index) { return (<recharts_1.Cell key={"cell-".concat(index)} fill={entry.color}/>); })}
          </recharts_1.Pie>
          <recharts_1.Tooltip formatter={function (value) { return ["".concat(value, "%"), 'Allocation']; }} contentStyle={{
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '8px',
            border: 'none',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
        }}/>
          <recharts_1.Legend />
        </recharts_1.PieChart>
      </recharts_1.ResponsiveContainer>
    </div>);
};
exports.default = AllocationChart;
