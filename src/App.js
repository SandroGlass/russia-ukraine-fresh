import React, { useState, useEffect } from 'react';
import { Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart } from 'recharts';

// Custom CSS in component for demo
const dashboardStyles = {
  container: {
    fontFamily: 'Inter, system-ui, sans-serif',
    backgroundColor: '#f5f7fa',
    padding: '1.5rem',
    paddingTop: '0.5rem',
    maxWidth: '1280px',
    margin: '0 auto',
  },
  title: {
    fontSize: '2.25rem',
    fontWeight: '700',
    marginBottom: '2rem',
    textAlign: 'center',
    color: '#1f2937',
    paddingBottom: '1rem',
    padding: '0 1rem',
  },
  sectionTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    marginTop: '2rem',
    marginBottom: '1.5rem',
    textAlign: 'left',
    color: '#1f2937',
    padding: '0 1rem',
    borderBottom: '1px solid #e5e7eb',
    paddingBottom: '0.75rem',
  },
  countrySelector: {
    display: 'flex',
    justifyContent: 'center',
    gap: '0.75rem',
    padding: '0.5rem 0',
  },
  countryButton: base => ({
    padding: '0.625rem 1.25rem',
    borderRadius: '8px',
    fontWeight: '500',
    border: '1px solid #e5e7eb',
    backgroundColor: 'white',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontSize: '0.9rem',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
    ...base
  }),
  activeButton: {
    backgroundColor: '#1f2937',
    color: 'white',
    borderColor: '#1f2937',
  },
  russiaActiveButton: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
    color: 'white',
    transform: 'translateY(-1px)',
  },
  ukraineActiveButton: {
    backgroundColor: '#FBBF24',
    borderColor: '#FBBF24',
    color: 'black',
    transform: 'translateY(-1px)',
  },
  mainCharts: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  donutChartsRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1.5rem',
    justifyContent: 'center',
    marginTop: '1rem',
    width: '100%',
  },
  dashboardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(500px, 1fr))',
    gap: '1.5rem',
    marginTop: '1.5rem',
  },
  chartContainer: {
    backgroundColor: 'white',
    padding: '1.25rem',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    marginBottom: '1rem',
  },
  donutContainer: {
    backgroundColor: 'white',
    padding: '1.25rem',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
    transition: 'all 0.3s ease',
    flex: '1 1 calc(50% - 1.5rem)',
    minWidth: '300px',
    maxWidth: '500px',
  },
  chartTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    marginBottom: '1rem',
    color: '#1f2937',
  },
  donutTitle: {
    fontSize: '1.125rem',
    fontWeight: '600',
    marginBottom: '0.75rem',
    color: '#1f2937',
    textAlign: 'center',
  },
  chartArea: {
    height: '350px',
    marginTop: '0.5rem',
  },
  pieChartArea: {
    height: '250px',
    marginTop: '0.5rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartNote: {
    marginTop: '1rem',
    padding: '0.75rem',
    backgroundColor: '#f3f4f6',
    borderLeft: '4px solid',
    borderRadius: '0 4px 4px 0',
    fontSize: '0.875rem',
    color: '#4b5563',
  },
  russiaNote: {
    borderLeftColor: '#3B82F6',
  },
  ukraineNote: {
    borderLeftColor: '#FBBF24',
  },
  customTooltip: {
    backgroundColor: 'white',
    padding: '0.75rem',
    border: 'none',
    borderRadius: '8px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  },
  tooltipLabel: {
    fontWeight: '600',
    marginTop: '0',
    marginBottom: '0.5rem',
    fontSize: '0.875rem',
    color: '#1f2937',
  },
  tooltipItem: color => ({
    margin: '0.125rem 0',
    fontSize: '0.875rem',
    color,
  }),
  footer: {
    marginTop: '2rem',
    textAlign: 'center',
    fontSize: '0.875rem',
    color: '#6b7280',
    paddingTop: '1rem',
    borderTop: '1px solid #e5e7eb',
  },
  timeframeNote: {
    marginTop: '1rem',
    padding: '0.75rem',
    backgroundColor: '#f3f4f6',
    borderRadius: '8px',
    fontSize: '0.875rem',
    color: '#4b5563',
    fontStyle: 'italic',
  },
  countryStatBox: {
    padding: '0.75rem',
    borderRadius: '8px',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: '0.75rem',
    color: 'white',
    textAlign: 'center',
  },
  insightBox: {
    marginTop: '1.5rem',
    padding: '1rem',
    backgroundColor: '#f3f4f6',
    borderRadius: '8px',
    fontSize: '0.875rem',
    color: '#4b5563',
    lineHeight: '1.5',
  }
};

// Sample data for demonstration
const sampleTimelineData = [
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

const sampleRussiaTypes = [
  { name: "Peaceful protest", value: 1526 },
  { name: "Protest with intervention", value: 449 },
  { name: "Excessive force against protesters", value: 1 }
];

const sampleUkraineTypes = [
  { name: "Peaceful protest", value: 671 },
  { name: "Protest with intervention", value: 18 },
  { name: "Excessive force against protesters", value: 17 }
];

const RussiaUkraineProtestDashboard = () => {
  const [activeCountry, setActiveCountry] = useState('both');
  const [animationKey, setAnimationKey] = useState(0);
  const [protestData] = useState({
    timeline: sampleTimelineData,
    protestTypes: {
      russia: sampleRussiaTypes,
      ukraine: sampleUkraineTypes
    },
    occupiedTerritoryInfo: {
      count: 28,
      percentage: 80.0
    }
  });

  // Reset animation key when country changes
  useEffect(() => {
    setAnimationKey(prevKey => prevKey + 1);
  }, [activeCountry]);

  // Colors for visualization with modern palette
  const COLORS = {
    russia: '#3B82F6', // Blue for Russia
    ukraine: '#FBBF24', // Yellow for Ukraine
    total: '#6366F1', // Indigo
    peaceful: '#10B981', // Green
    intervention: '#F59E0B', // Amber
    excessiveForce: '#EF4444', // Red
    other: '#8B5CF6', // Purple
  };

  // Calculate totals
  const totalProtests = protestData.timeline.reduce((sum, item) => sum + item.total, 0);
  const russiaProtests = protestData.timeline.reduce((sum, item) => sum + item.russia, 0);
  const ukraineProtests = protestData.timeline.reduce((sum, item) => sum + item.ukraine, 0);

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

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={dashboardStyles.customTooltip}>
          <p style={dashboardStyles.tooltipLabel}>{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={dashboardStyles.tooltipItem(entry.color)}>
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
      const periodData = protestData.timeline.find(item => item.period === label);
      const totalForPeriod = periodData ? periodData.total : 0;

      return (
        <div style={dashboardStyles.customTooltip}>
          <p style={dashboardStyles.tooltipLabel}>{label}</p>
          <p style={{
            ...dashboardStyles.tooltipItem('#333'),
            fontWeight: 'bold',
            borderBottom: '1px solid #eaeaea',
            paddingBottom: '0.25rem',
            marginBottom: '0.5rem'
          }}>
            Total: {totalForPeriod.toLocaleString()}
          </p>
          {payload.map((entry, index) => (
            <p key={index} style={dashboardStyles.tooltipItem(entry.color)}>
              {entry.dataKey === 'russia' ? 'Russia' : 'Ukraine'}: {entry.value.toLocaleString()}
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

  return (
    <div style={dashboardStyles.container}>
      <h1 style={dashboardStyles.title}>
        How <span style={{ color: COLORS.russia, fontWeight: 'bold' }}>Russians</span> and <span style={{ color: COLORS.ukraine, fontWeight: 'bold' }}>Ukrainians</span> protested since the Russian invasion of Ukraine?
      </h1>

      {/* Country selector - now with sticky positioning */}
      <div style={{
        position: 'sticky',
        top: '0',
        zIndex: '100',
        padding: '0.75rem 0',
        backgroundColor: '#f5f7fa',
        marginBottom: '1.5rem',
        borderBottom: '1px solid #e5e7eb',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
        width: '100%'
      }}>
        <p style={{
          textAlign: 'center',
          fontSize: '0.95rem',
          color: '#4b5563',
          marginBottom: '0.75rem',
          marginTop: '0'
        }}>
          Use the buttons below to view data for both countries or select a specific country.
        </p>
        <div style={dashboardStyles.countrySelector}>
          <button
            style={dashboardStyles.countryButton(
              activeCountry === 'both' ? dashboardStyles.activeButton : {}
            )}
            onClick={() => setActiveCountry('both')}
          >
            Both Countries
          </button>

          <button
            style={dashboardStyles.countryButton(
              activeCountry === 'russia' ? dashboardStyles.russiaActiveButton : {}
            )}
            onClick={() => setActiveCountry('russia')}
          >
            Russia
          </button>
          <button
            style={dashboardStyles.countryButton(
              activeCountry === 'ukraine' ? dashboardStyles.ukraineActiveButton : {}
            )}
            onClick={() => setActiveCountry('ukraine')}
          >
            Ukraine
          </button>
        </div>
      </div>

      <div style={dashboardStyles.mainCharts}>
        {/* Timeline Chart with Total Stats */}
        <div style={dashboardStyles.chartContainer}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={dashboardStyles.chartTitle}>
              {getChartTitle()}
            </h2>
          </div>

          <div style={dashboardStyles.chartArea}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={protestData.timeline}>
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
                  formatter={(value) => {
                    return value.charAt(0).toUpperCase() + value.slice(1);
                  }}
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
            <div style={{
              marginTop: '1rem',
              fontSize: '0.9rem',
              backgroundColor: '#f8f9fa',
              padding: '0.75rem',
              borderRadius: '6px',
              lineHeight: '1.5'
            }}>
              Distribution: <span style={{ fontWeight: '600', color: COLORS.russia }}>Russia</span> accounts for {russiaProtests.toLocaleString()} protests, while <span style={{ fontWeight: '600', color: COLORS.ukraine }}>Ukraine</span> accounts for {ukraineProtests.toLocaleString()} protests.
            </div>
          )}

          {/* Timeframe note */}
          <div style={dashboardStyles.timeframeNote}>

            <p style={{ margin: '0', fontStyle: 'normal' }}>
              <strong>Evolution of protests:</strong> Russian protests peaked in early 2022 with anti-war sentiment, then declined as repression increased.
              Ukrainian protests initially focused on resistance to invasion, but then shifted toward socio-economic issues in 2023-2024. A notable spike
              in Q3-Q4 2024 was related to mobilization policies.
            </p>
            <p style={{ marginTop: '4px', marginBottom: '0' }}>Data covers period from 24 February 2022 until 6 March 2025</p>
          </div>
        </div>

        {/* Unified Donut Charts Section with shared headline */}
        <h2 style={dashboardStyles.sectionTitle}>
          Protests were mostly peaceful... but there are nuances
        </h2>

        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1.5rem',
          justifyContent: 'center',
          marginTop: '1rem',
          width: '100%',
        }}>
          {/* Russia Donut Chart - Always render but hide when not needed */}
          <div
            key={`russia-donut-${animationKey}`}
            style={{
              backgroundColor: 'white',
              padding: activeCountry === 'ukraine' ? 0 : '1.25rem',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
              transition: 'all 0.3s ease',
              flex: activeCountry === 'both' ? '1 1 calc(50% - 1.5rem)' : '0 0 500px',
              minWidth: activeCountry === 'both' ? '300px' : 'auto',
              maxWidth: activeCountry === 'both' ? '500px' : '500px',
              marginBottom: '1rem',
              display: activeCountry === 'ukraine' ? 'none' : 'block',
              margin: activeCountry === 'both' ? undefined : '0 auto',
            }}
          >
            {activeCountry !== 'ukraine' && (
              <>

                <h3 style={{ ...dashboardStyles.donutTitle }}>
                  Protest Types in <span style={{ color: COLORS.russia, fontWeight: 'bold' }}>Russia</span>
                </h3>
                <div style={dashboardStyles.pieChartArea}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={protestData.protestTypes.russia}
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
                        {protestData.protestTypes.russia.map((entry, index) => (
                          <Cell key={`cell-russia-${index}`} fill={getTypeColor(entry.name)} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                {/* Note about excessive force in Russia */}
                {protestData.protestTypes.russia.some(type => type.name === 'Excessive force against protesters' && type.value > 0) && (
                  <div style={{ ...dashboardStyles.chartNote, ...dashboardStyles.russiaNote }}>
                    <strong>Note:</strong> Data shows {protestData.protestTypes.russia.find(t => t.name === 'Excessive force against protesters')?.value || 0}
                    {' '}instance of excessive force used against protesters in Russia.
                  </div>
                )}
              </>
            )}
          </div>

          {/* Ukraine Donut Chart - Always render but hide when not needed */}
          <div
            key={`ukraine-donut-${animationKey}`}
            style={{
              backgroundColor: 'white',
              padding: activeCountry === 'russia' ? 0 : '1.25rem',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
              transition: 'all 0.3s ease',
              flex: activeCountry === 'both' ? '1 1 calc(50% - 1.5rem)' : '0 0 500px',
              minWidth: activeCountry === 'both' ? '300px' : 'auto',
              maxWidth: activeCountry === 'both' ? '500px' : '500px',
              marginBottom: '1rem',
              display: activeCountry === 'russia' ? 'none' : 'block',
              margin: activeCountry === 'both' ? undefined : '0 auto',
            }}
          >
            {activeCountry !== 'russia' && (
              <>

                <h3 style={{ ...dashboardStyles.donutTitle }}>
                  Protest Types in <span style={{ color: COLORS.ukraine, fontWeight: 'bold' }}>Ukraine</span>
                </h3>
                <div style={dashboardStyles.pieChartArea}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={protestData.protestTypes.ukraine}
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
                        {protestData.protestTypes.ukraine.map((entry, index) => (
                          <Cell key={`cell-ukraine-${index}`} fill={getTypeColor(entry.name)} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                {/* Note about intervention/force in occupied territories */}
                {protestData.occupiedTerritoryInfo.count > 0 && (
                  <div style={{ ...dashboardStyles.chartNote, ...dashboardStyles.ukraineNote }}>
                    <strong>Note:</strong> {protestData.occupiedTerritoryInfo.count} instances ({protestData.occupiedTerritoryInfo.percentage}%)
                    of intervention or excessive force against protesters in Ukraine occurred in Russian-occupied territories.
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Additional insight box - changed to look like other notes */}
        <div style={{ ...dashboardStyles.chartNote, marginTop: '1.5rem', borderLeftColor: '#1f2937' }}>
          <strong>Insight:</strong> While the majority of protests in both countries were peaceful,
          there are notable differences in protest dynamics. In Russia, authorities were more likely to intervene
          in protests ({((protestData.protestTypes.russia.find(t => t.name === "Protest with intervention")?.value +
            protestData.protestTypes.russia.find(t => t.name === "Excessive force against protesters")?.value) /
            russiaProtests * 100).toFixed(1)}% of cases)
          compared to Ukraine ({((protestData.protestTypes.ukraine.find(t => t.name === "Protest with intervention")?.value +
            protestData.protestTypes.ukraine.find(t => t.name === "Excessive force against protesters")?.value) /
            ukraineProtests * 100).toFixed(1)}%).
          However, excessive force incidents in Ukraine were largely concentrated in Russian-occupied territories.
        </div>
      </div>

      <div style={dashboardStyles.footer}>
        <p>Data source: ACLED (Armed Conflict Location and Event Data,) Event dataset covering protests in Russia and Ukraine (2022-2025)</p>
        <p>You can find the dataset <a href="https://drive.google.com/file/d/1ktrSGxXXXOzrhJgMIkhfFeRzU1PT3XVB/view?usp=sharing">here</a> </p>
      </div>
    </div>
  );
};

export default RussiaUkraineProtestDashboard;