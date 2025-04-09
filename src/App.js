import React, { useState, useEffect } from 'react';
import {
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  BarChart,
  Bar
} from 'recharts';
import './App.css';

// Colors for visualization
const COLORS = {
  russia: '#3B82F6', // Blue for Russia
  ukraine: '#FBBF24', // Yellow for Ukraine
  total: '#6366F1', // Indigo
  peaceful: '#10B981', // Green
  intervention: '#F59E0B', // Amber
  excessiveForce: '#EF4444', // Red
  other: '#8B5CF6', // Purple
};

// Sample data for the timeline chart
const timelineData = [
  { period: "2022 Q1", russia: 400, ukraine: 112, total: 512, quarter: 1, year: 2022 },
  { period: "2022 Q2", russia: 358, ukraine: 33, total: 391, quarter: 2, year: 2022 },
  { period: "2022 Q3", russia: 305, ukraine: 31, total: 336, quarter: 3, year: 2022 },
  { period: "2022 Q4", russia: 102, ukraine: 17, total: 119, quarter: 4, year: 2022 },
  { period: "2023 Q1", russia: 103, ukraine: 16, total: 119, quarter: 1, year: 2023 },
  { period: "2023 Q2", russia: 83, ukraine: 17, total: 100, quarter: 2, year: 2023 },
  { period: "2023 Q3", russia: 122, ukraine: 21, total: 143, quarter: 3, year: 2023 },
  { period: "2023 Q4", russia: 98, ukraine: 80, total: 178, quarter: 4, year: 2023 },
  { period: "2024 Q1", russia: 48, ukraine: 121, total: 169, quarter: 1, year: 2024 },
  { period: "2024 Q2", russia: 46, ukraine: 86, total: 132, quarter: 2, year: 2024 },
  { period: "2024 Q3", russia: 129, ukraine: 70, total: 199, quarter: 3, year: 2024 },
  { period: "2024 Q4", russia: 118, ukraine: 61, total: 179, quarter: 4, year: 2024 },
  { period: "2025 Q1", russia: 64, ukraine: 41, total: 105, quarter: 1, year: 2025 }
];

const protestTypes = {
  russia: [
    { name: "Peaceful protest", value: 1526 },
    { name: "Protest with intervention", value: 449 },
    { name: "Excessive force against protesters", value: 1 }
  ],
  ukraine: [
    { name: "Peaceful protest", value: 671 },
    { name: "Protest with intervention", value: 18 },
    { name: "Excessive force against protesters", value: 17 }
  ]
};

// Protest reasons data
const protestReasonsData = [
  { category: "Anti-War/Pro-Ukraine", russia: 581, ukraine: 108, russiaPct: 29.4, ukrainePct: 15.3 },
  { category: "Pro-War/Pro-Russia", russia: 532, ukraine: 73, russiaPct: 26.9, ukrainePct: 10.3 },
  { category: "Prisoner Exchange/POWs", russia: 47, ukraine: 370, russiaPct: 2.4, ukrainePct: 52.4 },
  { category: "Infrastructure/Services", russia: 157, ukraine: 46, russiaPct: 7.9, ukrainePct: 6.5 },
  { category: "Anti-Mobilization", russia: 70, ukraine: 91, russiaPct: 3.5, ukrainePct: 12.9 },
  { category: "Local Governance", russia: 116, ukraine: 9, russiaPct: 5.9, ukrainePct: 1.3 },
  { category: "Political/Election Issues", russia: 82, ukraine: 1, russiaPct: 4.1, ukrainePct: 0.1 },
  { category: "Environmental Concerns", russia: 62, ukraine: 0, russiaPct: 3.1, ukrainePct: 0 },
  { category: "Economic Issues", russia: 38, ukraine: 0, russiaPct: 1.9, ukrainePct: 0 },
  { category: "Other", russia: 291, ukraine: 8, russiaPct: 14.7, ukrainePct: 1.1 }
];

// Data for the intervention reasons chart
const interventionData = [
  { category: "Anti-War/Pro-Ukraine", russia: 380, ukraine: 29, russiaPct: 84.4, ukrainePct: 82.9 },
  { category: "Anti-Mobilization", russia: 34, ukraine: 0, russiaPct: 7.6, ukrainePct: 0 },
  { category: "Pro-War/Pro-Russia", russia: 7, ukraine: 2, russiaPct: 1.6, ukrainePct: 5.7 },
  { category: "Environmental Concerns", russia: 7, ukraine: 0, russiaPct: 1.6, ukrainePct: 0 },
  { category: "Infrastructure/Services", russia: 7, ukraine: 1, russiaPct: 1.6, ukrainePct: 2.9 },
  { category: "Local Governance", russia: 6, ukraine: 2, russiaPct: 1.3, ukrainePct: 5.7 },
  { category: "Political/Election Issues", russia: 5, ukraine: 0, russiaPct: 1.1, ukrainePct: 0 },
  { category: "Prisoner Exchange/POWs", russia: 3, ukraine: 1, russiaPct: 0.7, ukrainePct: 2.9 },
  { category: "Economic Issues", russia: 1, ukraine: 0, russiaPct: 0.2, ukrainePct: 0 }
];

const RussiaUkraineProtestDashboard = () => {
  const [activeCountry, setActiveCountry] = useState('both');
  const [animationKey, setAnimationKey] = useState(0);
  const [viewMode, setViewMode] = useState('absolute'); // 'absolute' or 'percentage'

  // Reset animation key when country changes
  useEffect(() => {
    setAnimationKey(prevKey => prevKey + 1);
  }, [activeCountry]);

  // Calculate totals
  const totalProtests = timelineData.reduce((sum, item) => sum + item.total, 0);
  const russiaProtests = timelineData.reduce((sum, item) => sum + item.russia, 0);
  const ukraineProtests = timelineData.reduce((sum, item) => sum + item.ukraine, 0);

  const getTypeColor = (name) => {
    switch (name) {
      case 'Peaceful protest': return COLORS.peaceful;
      case 'Protest with intervention': return COLORS.intervention;
      case 'Excessive force against protesters': return COLORS.excessiveForce;
      default: return COLORS.other;
    }
  };

  // Get appropriate title for the chart based on selected country
  const getChartTitle = () => {
    if (activeCountry === 'both') {
      return `${totalProtests.toLocaleString()} protest events occurred in both countries`;
    } else if (activeCountry === 'russia') {
      return `${russiaProtests.toLocaleString()} protest events occurred in Russia`;
    } else {
      return `${ukraineProtests.toLocaleString()} protest events occurred in Ukraine`;
    }
  };

  // Toggle the view mode between absolute numbers and percentages
  const toggleViewMode = () => {
    setViewMode(viewMode === 'absolute' ? 'percentage' : 'absolute');
  };

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="tooltip-item" style={{ color: entry.color }}>
              {entry.name}: {entry.value.toLocaleString()}
              {entry.payload && entry.payload.percent && ` (${(entry.payload.percent * 100).toFixed(1)}%)`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Custom tooltip for timeline chart
  const TimelineTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      // Get the total value for this quarter from the data
      const periodData = timelineData.find(item => item.period === label);
      const totalForPeriod = periodData ? periodData.total : 0;

      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{label}</p>
          <p className="tooltip-total">
            Total: {totalForPeriod.toLocaleString()}
          </p>
          {payload.map((entry, index) => (
            <p key={index} className="tooltip-item" style={{ color: entry.color }}>
              {entry.dataKey === 'russia' ? 'Russia' : 'Ukraine'}: {entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Custom tooltip for bar chart
  const BarChartTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="tooltip-item" style={{ color: entry.color }}>
              {entry.name}: {entry.value.toLocaleString()}
              {viewMode === 'percentage' && '%'}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Format pie chart labels
  const formatPieLabel = ({ name, value, percent }) => {
    // Format the percentage
    const percentFormatted = `${(percent * 100).toFixed(1)}%`;

    // Handle long labels specifically
    if (name === 'Excessive force against protesters') {
      return `Exc. force: ${percentFormatted}`;
    } else if (name === 'Protest with intervention') {
      return `Intervention: ${percentFormatted}`;
    } else if (name === 'Peaceful protest') {
      return `Peaceful: ${percentFormatted}`;
    }

    // Default formatting for other labels
    return `${name}: ${percentFormatted}`;
  };

  // Filter the protest reasons data based on active country
  const getFilteredReasonData = () => {
    if (activeCountry === 'both') {
      return protestReasonsData;
    } else if (activeCountry === 'russia') {
      return protestReasonsData
        .filter(item => item.russia > 0)
        .map(item => ({
          ...item,
          ukraine: 0,
          ukrainePct: 0
        }));
    } else {
      return protestReasonsData
        .filter(item => item.ukraine > 0)
        .map(item => ({
          ...item,
          russia: 0,
          russiaPct: 0
        }));
    }
  };

  // Filter the intervention data based on active country
  const getFilteredInterventionData = () => {
    if (activeCountry === 'both') {
      return interventionData;
    } else if (activeCountry === 'russia') {
      return interventionData
        .filter(item => item.russia > 0)
        .map(item => ({
          ...item,
          ukraine: 0,
          ukrainePct: 0
        }));
    } else {
      return interventionData
        .filter(item => item.ukraine > 0)
        .map(item => ({
          ...item,
          russia: 0,
          russiaPct: 0
        }));
    }
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">
        How <span style={{ color: COLORS.russia, fontWeight: 'bold' }}>Russians</span> and <span style={{ color: COLORS.ukraine, fontWeight: 'bold' }}>Ukrainians</span> protested since the Russian invasion of Ukraine?
      </h1>

      {/* Country selector */}
      <div className="sticky-header">
        <p className="header-text">
          Use the buttons below to view data for both countries or select a specific country.
        </p>
        <div className="country-selector">
          <button
            className={`country-button ${activeCountry === 'both' ? 'active-button' : ''}`}
            onClick={() => setActiveCountry('both')}
          >
            Both Countries
          </button>

          <button
            className={`country-button ${activeCountry === 'russia' ? 'russia-active-button' : ''}`}
            onClick={() => setActiveCountry('russia')}
          >
            Russia
          </button>
          <button
            className={`country-button ${activeCountry === 'ukraine' ? 'ukraine-active-button' : ''}`}
            onClick={() => setActiveCountry('ukraine')}
          >
            Ukraine
          </button>
        </div>
      </div>

      <div className="main-charts">
        {/* Timeline Chart with Total Stats */}
        <div className="chart-container">
          <div className="flex-space-between">
            <h2 className="chart-title">
              {getChartTitle()}
            </h2>
          </div>

          <div className="chart-area">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eaeaea" />
                <XAxis
                  dataKey="period"
                  tick={{ fill: '#666', fontSize: 12 }}
                  axisLine={{ stroke: '#ccc' }}
                />
                <YAxis
                  tick={{ fill: '#666', fontSize: 12 }}
                  axisLine={{ stroke: '#ccc' }}
                />
                <Tooltip content={<TimelineTooltip />} />
                <Legend
                  wrapperStyle={{ paddingTop: 10 }}
                  formatter={(value) => value.charAt(0).toUpperCase() + value.slice(1)}
                />
                <Line
                  type="monotone"
                  dataKey="russia"
                  name="Russia"
                  stroke={COLORS.russia}
                  strokeWidth={3}
                  dot={{ stroke: COLORS.russia, strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: COLORS.russia, strokeWidth: 2 }}
                  hide={activeCountry === 'ukraine'}
                  animationDuration={1000}
                />
                <Line
                  type="monotone"
                  dataKey="ukraine"
                  name="Ukraine"
                  stroke={COLORS.ukraine}
                  strokeWidth={3}
                  dot={{ stroke: COLORS.ukraine, strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: COLORS.ukraine, strokeWidth: 2 }}
                  hide={activeCountry === 'russia'}
                  animationDuration={1000}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Only show distribution when both countries are selected */}
          {activeCountry === 'both' && (
            <h3 className="sub-heading" style={{ marginTop: '1rem' }}>
              Distribution: <span style={{ fontWeight: '600', color: COLORS.russia }}>Russia</span> accounts for {russiaProtests.toLocaleString()} protests, while <span style={{ fontWeight: '600', color: COLORS.ukraine }}>Ukraine</span> accounts for {ukraineProtests.toLocaleString()} protests.
            </h3>
          )}

          {/* Timeframe note */}
          <div className="timeframe-note">
            <p style={{ margin: '0', fontStyle: 'normal' }}>
              <strong>Key insights:</strong> Russian protests peaked in early 2022 with anti-war sentiment, then declined as repression increased.
              Ukrainian protests initially focused on resistance to invasion, but then shifted toward socio-economic issues in 2023-2024. Ukraine's notable spike in Q4 2023 was related to its mobilization policies.
            </p>
            <p style={{ marginTop: '4px', marginBottom: '0' }}>Data covers period from 24 February 2022 until 6 March 2025</p>
          </div>
        </div>

        {/* Protest Reasons Bar Chart */}
        <div className="chart-container">
          <div style={{ marginBottom: '1rem' }}>
            <div className="flex-space-between">
              <div>
                <h2 className="chart-title">
                  Almost 690 protests in both countries were against the war/anti-Russia
                </h2>
                <h3 className="sub-heading">
                  But pro-war/pro-Kremlin protests were pretty close with 605 events recorded
                </h3>
              </div>
              <button
                onClick={toggleViewMode}
                className="view-toggle"
              >
                {viewMode === 'absolute' ? 'Show Percentages(%)' : 'Show Absolute Values'}
              </button>
            </div>
          </div>

          <div className="bar-chart-area">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={getFilteredReasonData()}
                layout="vertical"
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#eaeaea" />
                <XAxis type="number" />
                <YAxis
                  type="category"
                  dataKey="category"
                  tick={{ fontSize: 12 }}
                  width={130}
                />
                <Tooltip content={<BarChartTooltip />} />
                <Legend
                  wrapperStyle={{ paddingTop: 10 }}
                  formatter={(value) => value.charAt(0).toUpperCase() + value.slice(1)}
                />
                <Bar
                  dataKey={viewMode === 'absolute' ? 'russia' : 'russiaPct'}
                  name="Russia"
                  fill={COLORS.russia}
                  hide={activeCountry === 'ukraine'}
                  animationDuration={1000}
                />
                <Bar
                  dataKey={viewMode === 'absolute' ? 'ukraine' : 'ukrainePct'}
                  name="Ukraine"
                  fill={COLORS.ukraine}
                  hide={activeCountry === 'russia'}
                  animationDuration={1000}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="timeframe-note">
            <p style={{ margin: '0', fontStyle: 'normal' }}>
              <strong>Key insights:</strong> Russian protests were primarily focused on anti-war sentiment and pro-regime support.
              Ukrainian protests were dominated by prisoner exchange/POW concerns, with anti-mobilization issues also significant.
            </p>
          </div>
        </div>

        {/* Unified Donut Charts Section with shared headline */}
        <h2 className="section-title">
          Most protests (2,197) were peaceful... but there are nuances
        </h2>

        <div className="donut-charts-row">
          {/* Russia Donut Chart */}
          {(activeCountry === 'both' || activeCountry === 'russia') && (
            <div
              key={`russia-donut-${animationKey}`}
              className={`donut-container ${activeCountry === 'both' ? '' : 'single-country'}`}
            >
              <h3 className="donut-title">
                Protest Types in <span style={{ color: COLORS.russia, fontWeight: 'bold' }}>Russia</span>
              </h3>
              <div className="pie-chart-area">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={protestTypes.russia}
                      cx="50%"
                      cy="50%"
                      labelLine={{ stroke: '#666', strokeWidth: 1 }}
                      outerRadius={90}
                      innerRadius={60}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={formatPieLabel}
                      isAnimationActive={true}
                      animationBegin={0}
                      animationDuration={800}
                      animationEasing="ease-out"
                    >
                      {protestTypes.russia.map((entry, index) => (
                        <Cell key={`cell-russia-${index}`} fill={getTypeColor(entry.name)} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              {protestTypes.russia.some(type => type.name === 'Excessive force against protesters' && type.value > 0) && (
                <div className="chart-note russia-note">
                  <strong>Note:</strong> Data shows {protestTypes.russia.find(t => t.name === 'Excessive force against protesters')?.value || 0}
                  {' '}instance of excessive force used against protesters in Russia.
                </div>
              )}
            </div>
          )}

          {/* Ukraine Donut Chart */}
          {(activeCountry === 'both' || activeCountry === 'ukraine') && (
            <div
              key={`ukraine-donut-${animationKey}`}
              className={`donut-container ${activeCountry === 'both' ? '' : 'single-country'}`}
            >
              <h3 className="donut-title">
                Protest Types in <span style={{ color: COLORS.ukraine, fontWeight: 'bold' }}>Ukraine</span>
              </h3>
              <div className="pie-chart-area">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={protestTypes.ukraine}
                      cx="50%"
                      cy="50%"
                      labelLine={{ stroke: '#666', strokeWidth: 1 }}
                      outerRadius={90}
                      innerRadius={60}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={formatPieLabel}
                      isAnimationActive={true}
                      animationBegin={0}
                      animationDuration={800}
                      animationEasing="ease-out"
                    >
                      {protestTypes.ukraine.map((entry, index) => (
                        <Cell key={`cell-ukraine-${index}`} fill={getTypeColor(entry.name)} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              {/* Note about intervention/force in occupied territories */}
              <div className="chart-note ukraine-note">
                <strong>Note:</strong> 29 instances (80.0%)
                of intervention or excessive force against protesters in Ukraine occurred in Russian-occupied territories.
              </div>
            </div>
          )}
        </div>

        {/* Additional insight box */}
        <div className="chart-note insight-note">
          <strong>Insight:</strong>
          There are notable differences in protest dynamics. In Russia, authorities were more likely to intervene
          in protests ({((protestTypes.russia.find(t => t.name === "Protest with intervention")?.value +
            protestTypes.russia.find(t => t.name === "Excessive force against protesters")?.value) /
            russiaProtests * 100).toFixed(1)}% of cases)
          compared to Ukraine ({((protestTypes.ukraine.find(t => t.name === "Protest with intervention")?.value +
            protestTypes.ukraine.find(t => t.name === "Excessive force against protesters")?.value) /
            ukraineProtests * 100).toFixed(1)}%).
          Moreover, excessive force incidents in Ukraine were largely concentrated in Russian-occupied territories.
        </div>

        {/* Intervention Reasons Bar Chart */}
        <div className="chart-container">
          <div style={{ marginBottom: '1rem' }}>
            <div className="flex-space-between">
              <div>
                <h2 className="chart-title">
                  Overall, 485 protests were met either with intervention, or excessive force
                </h2>
                <h3 className="sub-heading">
                  The overwhelming majority of those (409) were anti-war/pro-Ukraine
                </h3>
              </div>
              <button
                onClick={toggleViewMode}
                className="view-toggle"
              >
                {viewMode === 'absolute' ? 'Show Percentages (%)' : 'Show Absolute Values'}
              </button>
            </div>
          </div>

          <div className="bar-chart-area">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={getFilteredInterventionData()}
                layout="vertical"
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#eaeaea" />
                <XAxis type="number" />
                <YAxis
                  type="category"
                  dataKey="category"
                  tick={{ fontSize: 12 }}
                  width={130}
                />
                <Tooltip content={<BarChartTooltip />} />
                <Legend
                  wrapperStyle={{ paddingTop: 10 }}
                  formatter={(value) => value.charAt(0).toUpperCase() + value.slice(1)}
                />
                <Bar
                  dataKey={viewMode === 'absolute' ? 'russia' : 'russiaPct'}
                  name="Russia"
                  fill={COLORS.russia}
                  hide={activeCountry === 'ukraine'}
                  animationDuration={1000}
                />
                <Bar
                  dataKey={viewMode === 'absolute' ? 'ukraine' : 'ukrainePct'}
                  name="Ukraine"
                  fill={COLORS.ukraine}
                  hide={activeCountry === 'russia'}
                  animationDuration={1000}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="timeframe-note">
            <p style={{ margin: '0', fontStyle: 'normal' }}>
              <strong>Key insights:</strong> Russia has targeted over half of its anti-war/Pro-Ukraine protests and 29 cases which occured on the occupied territory of Ukraine.
              Anti-mobilization protests in Russia were the second most likely to face intervention (7.6% of cases), while pro-Russian protests
              and local governance protests were the second most targeted in Ukraine (5.7% each).
            </p>
          </div>
        </div>
      </div>

      <div className="footer">
        <p>Data source: ACLED (Armed Conflict Location and Event Data) Event dataset covering protests in Russia and Ukraine (2022-2025)</p>
        <p>You can find the dataset <a href="https://drive.google.com/file/d/1ktrSGxXXXOzrhJgMIkhfFeRzU1PT3XVB/view?usp=sharing">here</a></p>
      </div>
    </div>
  );
};

export default RussiaUkraineProtestDashboard;