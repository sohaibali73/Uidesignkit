import React, { useState } from 'react';
import { Search, TrendingUp, BarChart3, Newspaper, Building, DollarSign, Settings, ArrowUpRight, ArrowDownRight, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useResearcher } from '../hooks/useResearcher';
import { CompanyResearch, NewsItem } from '../types/researcher';

const ResearcherPage = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [searchInput, setSearchInput] = useState('');
  const {
    // State
    companyData,
    newsData,
    strategyAnalysis,
    peerComparison,
    macroContext,
    reports,
    loading,
    error,

    // Actions
    fetchCompanyResearch,
    fetchCompanyNews,
    analyzeStrategyFit,
    getPeerComparison,
    getMacroContext,
    generateReport,
    exportReport,
    searchResearch,
    getTrendingResearch,
    getHealth,
    setCurrentSymbol,
    setReportType,
    addComparisonSymbol,
    removeComparisonSymbol,
    clearComparisonSymbols,
    resetState,
  } = useResearcher();

  // Potomac color system
  const colors = {
    // Gray scale
    gray100: '#212121',
    gray80: '#424242',
    gray60: '#757575',
    gray40: '#BDBDBD',
    gray20: '#EEEEEE',
    white: '#FFFFFF',
    // Accent
    yellow: '#FEC00F',
    yellowAlt: '#FFD740',
    // Supporting
    green: '#2D7F3E',
    red: '#DC2626',
    blue: '#0052CC',
  };

  const handleSearch = async (e) => {
    e.preventDefault?.();
    if (searchInput.trim()) {
      const upperSymbol = searchInput.trim().toUpperCase();
      setCurrentView('company');
      setCurrentSymbol(upperSymbol);
      
      try {
        await fetchCompanyResearch(upperSymbol);
      } catch (err) {
        console.error('Error fetching company research:', err);
      }
    }
  };

  const MetricCard = ({ label, value, unit = '', change = null, icon: Icon = null }) => (
    <div 
      style={{
        backgroundColor: colors.white,
        border: `1px solid ${colors.gray20}`,
        borderRadius: '8px',
        padding: '20px',
        transition: 'all 0.2s ease',
      }}
      className="hover:shadow-sm hover:border-yellow-300"
    >
      <div style={{ color: colors.gray60, fontSize: '13px', fontFamily: 'Quicksand', marginBottom: '12px' }}>
        {label}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <div style={{ fontSize: '24px', fontFamily: 'Rajdhani', fontWeight: 700, color: colors.gray100 }}>
          {value}{unit}
        </div>
        {change !== null && (
          <div style={{
            fontSize: '13px',
            fontFamily: 'Quicksand',
            color: change >= 0 ? colors.green : colors.red,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}>
            {change >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
            {Math.abs(change)}%
          </div>
        )}
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '48px' }}>
        <h1 style={{
          fontSize: '48px',
          fontFamily: 'Rajdhani',
          fontWeight: 700,
          color: colors.gray100,
          letterSpacing: '2px',
          marginBottom: '12px',
          textTransform: 'uppercase',
        }}>
          MARKET RESEARCHER
        </h1>
        <p style={{
          fontSize: '15px',
          fontFamily: 'Quicksand',
          color: colors.gray60,
          lineHeight: '1.6',
        }}>
          Comprehensive financial research and market intelligence platform
        </p>
      </div>

      {/* Search Section */}
      <div 
        style={{
          backgroundColor: colors.white,
          border: `1px solid ${colors.gray20}`,
          borderRadius: '8px',
          padding: '24px',
          marginBottom: '48px',
        }}
      >
        <label style={{
          display: 'block',
          fontSize: '14px',
          fontFamily: 'Rajdhani',
          fontWeight: 500,
          color: colors.gray80,
          letterSpacing: '0.5px',
          marginBottom: '12px',
          textTransform: 'uppercase',
        }}>
          Search Company
        </label>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search style={{
              position: 'absolute',
              left: '16px',
              top: '14px',
              color: colors.gray60,
              width: '20px',
              height: '20px',
            }} />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch({ preventDefault: () => {} })}
              placeholder="Enter stock symbol (AAPL, MSFT, GOOGL)"
              style={{
                width: '100%',
                backgroundColor: colors.gray20,
                border: `1px solid ${colors.gray40}`,
                borderRadius: '6px',
                padding: '14px 16px 14px 48px',
                fontSize: '15px',
                fontFamily: 'Quicksand',
                color: colors.gray100,
              }}
              onFocus={(e) => e.target.style.borderColor = colors.yellow}
              onBlur={(e) => e.target.style.borderColor = colors.gray40}
            />
          </div>
          <button
            onClick={(e) => handleSearch({ preventDefault: () => {} })}
            style={{
              paddingLeft: '32px',
              paddingRight: '32px',
              backgroundColor: colors.yellow,
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontFamily: 'Quicksand',
              fontWeight: 600,
              color: colors.gray100,
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => e.target.style.opacity = '0.9'}
            onMouseLeave={(e) => e.target.style.opacity = '1'}
          >
            Research
          </button>
        </div>
      </div>

      {/* Research Categories Grid */}
      <div style={{ marginBottom: '48px' }}>
        <h2 style={{
          fontSize: '20px',
          fontFamily: 'Rajdhani',
          fontWeight: 600,
          color: colors.gray100,
          letterSpacing: '0.5px',
          marginBottom: '24px',
          textTransform: 'uppercase',
        }}>
          Research Tools
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
        }}>
          {[
            { icon: Building, label: 'COMPANY RESEARCH', desc: 'Deep dive into fundamentals and financials', view: 'company' },
            { icon: TrendingUp, label: 'STRATEGY ANALYSIS', desc: 'Analyze strategy fit for current market', view: 'strategy' },
            { icon: BarChart3, label: 'PEER COMPARISON', desc: 'Compare against industry peers', view: 'comparison' },
            { icon: Newspaper, label: 'NEWS ANALYSIS', desc: 'Aggregated news with sentiment', view: 'news' },
            { icon: DollarSign, label: 'MACRO CONTEXT', desc: 'Economic indicators and outlook', view: 'macro' },
            { icon: Settings, label: 'SETTINGS', desc: 'Configure research preferences', view: 'settings' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.view}
                onClick={() => setCurrentView(item.view)}
                style={{
                  backgroundColor: colors.white,
                  border: `1px solid ${colors.gray20}`,
                  borderRadius: '8px',
                  padding: '28px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = colors.yellow;
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = colors.gray20;
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <Icon style={{ color: colors.yellow, marginBottom: '12px', width: '28px', height: '28px' }} />
                <div style={{
                  fontSize: '16px',
                  fontFamily: 'Rajdhani',
                  fontWeight: 600,
                  color: colors.gray100,
                  letterSpacing: '0.5px',
                  marginBottom: '8px',
                  textTransform: 'uppercase',
                }}>
                  {item.label}
                </div>
                <div style={{
                  fontSize: '13px',
                  fontFamily: 'Quicksand',
                  color: colors.gray60,
                }}>
                  {item.desc}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div 
        style={{
          backgroundColor: colors.white,
          border: `1px solid ${colors.gray20}`,
          borderRadius: '8px',
          padding: '28px',
        }}
      >
        <h3 style={{
          fontSize: '16px',
          fontFamily: 'Rajdhani',
          fontWeight: 600,
          color: colors.gray100,
          letterSpacing: '0.5px',
          marginBottom: '16px',
          textTransform: 'uppercase',
        }}>
          Recent Activity
        </h3>
        <div style={{
          fontSize: '14px',
          fontFamily: 'Quicksand',
          color: colors.gray60,
        }}>
          No research history yet. Start by searching for a company.
        </div>
      </div>
    </div>
  );

  const renderCompanyResearch = () => (
    <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
      {/* Header with Back Button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <h1 style={{
            fontSize: '48px',
            fontFamily: 'Rajdhani',
            fontWeight: 700,
            color: colors.gray100,
            letterSpacing: '2px',
            marginBottom: '8px',
            textTransform: 'uppercase',
          }}>
            {companyData?.symbol || 'COMPANY'}
          </h1>
          {companyData && (
            <p style={{
              fontSize: '15px',
              fontFamily: 'Quicksand',
              color: colors.gray60,
            }}>
              {companyData.name} • {companyData.sector}
            </p>
          )}
        </div>
        <button
          onClick={() => { setCurrentView('dashboard'); setSearchInput(''); }}
          style={{
            backgroundColor: 'transparent',
            border: `1px solid ${colors.gray40}`,
            borderRadius: '6px',
            padding: '12px 20px',
            fontSize: '13px',
            fontFamily: 'Quicksand',
            fontWeight: 600,
            color: colors.gray80,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = colors.yellow;
            e.currentTarget.style.color = colors.yellow;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = colors.gray40;
            e.currentTarget.style.color = colors.gray80;
          }}
        >
          ← Back
        </button>
      </div>

      {loading ? (
        <div 
          style={{
            backgroundColor: colors.white,
            border: `1px solid ${colors.gray20}`,
            borderRadius: '8px',
            padding: '64px 32px',
            textAlign: 'center',
          }}
        >
          <div style={{ animation: 'pulse 2s ease-in-out infinite' }}>
            <div style={{
              height: '16px',
              backgroundColor: colors.gray20,
              borderRadius: '4px',
              marginBottom: '12px',
            }}></div>
            <div style={{
              height: '16px',
              backgroundColor: colors.gray20,
              borderRadius: '4px',
              width: '50%',
              margin: '0 auto',
            }}></div>
          </div>
        </div>
      ) : companyData ? (
        <div>
          {/* Key Metrics Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '16px',
            marginBottom: '48px',
          }}>
            <MetricCard label="P/E Ratio" value={companyData.fundamentals.pe_ratio} />
            <MetricCard label="Market Cap" value={companyData.fundamentals.market_cap} />
            <MetricCard label="Revenue Growth" value={companyData.fundamentals.revenue_growth} unit="%" />
            <MetricCard label="Earnings Growth" value={companyData.fundamentals.earnings_growth} unit="%" change={companyData.fundamentals.earnings_growth} />
          </div>

          {/* Main Content Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px',
            marginBottom: '48px',
          }}>
            {/* Analyst Consensus */}
            <div 
              style={{
                backgroundColor: colors.white,
                border: `1px solid ${colors.gray20}`,
                borderRadius: '8px',
                padding: '28px',
              }}
            >
              <h3 style={{
                fontSize: '14px',
                fontFamily: 'Rajdhani',
                fontWeight: 500,
                color: colors.gray60,
                letterSpacing: '0.5px',
                marginBottom: '16px',
                textTransform: 'uppercase',
              }}>
                Analyst Consensus
              </h3>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', marginBottom: '24px' }}>
                <div>
                  <div style={{
                    fontSize: '12px',
                    fontFamily: 'Quicksand',
                    color: colors.gray60,
                    marginBottom: '4px',
                  }}>Rating</div>
                  <div style={{
                    fontSize: '28px',
                    fontFamily: 'Rajdhani',
                    fontWeight: 700,
                    color: colors.green,
                    letterSpacing: '0.5px',
                  }}>
                    {companyData.analyst_consensus.rating}
                  </div>
                </div>
                <CheckCircle style={{ color: colors.green, width: '28px', height: '28px' }} />
              </div>
              <div style={{
                paddingTop: '16px',
                borderTop: `1px solid ${colors.gray20}`,
              }}>
                <div style={{
                  fontSize: '12px',
                  fontFamily: 'Quicksand',
                  color: colors.gray60,
                  marginBottom: '8px',
                }}>Target Price</div>
                <div style={{
                  fontSize: '24px',
                  fontFamily: 'Rajdhani',
                  fontWeight: 700,
                  color: colors.gray100,
                  marginBottom: '16px',
                }}>
                  ${companyData.analyst_consensus.target_price.toFixed(2)}
                </div>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  gap: '8px',
                  fontSize: '12px',
                  fontFamily: 'Quicksand',
                }}>
                  <div style={{ padding: '8px', backgroundColor: 'rgba(45, 127, 62, 0.1)', borderRadius: '4px', textAlign: 'center' }}>
                    <div style={{ color: colors.gray60, marginBottom: '4px' }}>Buy</div>
                    <div style={{ color: colors.green, fontWeight: 600 }}>{companyData.analyst_consensus.buy}</div>
                  </div>
                  <div style={{ padding: '8px', backgroundColor: 'rgba(191, 144, 0, 0.1)', borderRadius: '4px', textAlign: 'center' }}>
                    <div style={{ color: colors.gray60, marginBottom: '4px' }}>Hold</div>
                    <div style={{ color: '#BF9000', fontWeight: 600 }}>{companyData.analyst_consensus.hold}</div>
                  </div>
                  <div style={{ padding: '8px', backgroundColor: 'rgba(220, 38, 38, 0.1)', borderRadius: '4px', textAlign: 'center' }}>
                    <div style={{ color: colors.gray60, marginBottom: '4px' }}>Sell</div>
                    <div style={{ color: colors.red, fontWeight: 600 }}>{companyData.analyst_consensus.sell}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Insider Activity */}
            <div 
              style={{
                backgroundColor: colors.white,
                border: `1px solid ${colors.gray20}`,
                borderRadius: '8px',
                padding: '28px',
              }}
            >
              <h3 style={{
                fontSize: '14px',
                fontFamily: 'Rajdhani',
                fontWeight: 500,
                color: colors.gray60,
                letterSpacing: '0.5px',
                marginBottom: '16px',
                textTransform: 'uppercase',
              }}>
                Insider Activity
              </h3>
              <div style={{ display: 'flex', gap: '24px', marginBottom: '24px' }}>
                <div>
                  <div style={{
                    fontSize: '12px',
                    fontFamily: 'Quicksand',
                    color: colors.gray60,
                    marginBottom: '8px',
                  }}>Recent Buys</div>
                  <div style={{
                    fontSize: '32px',
                    fontFamily: 'Rajdhani',
                    fontWeight: 700,
                    color: colors.green,
                  }}>
                    +{companyData.insider_activity.recent_buys}
                  </div>
                </div>
                <div>
                  <div style={{
                    fontSize: '12px',
                    fontFamily: 'Quicksand',
                    color: colors.gray60,
                    marginBottom: '8px',
                  }}>Recent Sells</div>
                  <div style={{
                    fontSize: '32px',
                    fontFamily: 'Rajdhani',
                    fontWeight: 700,
                    color: colors.red,
                  }}>
                    -{companyData.insider_activity.recent_sells}
                  </div>
                </div>
              </div>
              <div style={{
                paddingTop: '16px',
                borderTop: `1px solid ${colors.gray20}`,
              }}>
                <div style={{
                  fontSize: '12px',
                  fontFamily: 'Quicksand',
                  color: colors.gray60,
                  marginBottom: '8px',
                }}>Net Position</div>
                <div style={{
                  fontSize: '18px',
                  fontFamily: 'Rajdhani',
                  fontWeight: 600,
                  color: colors.green,
                }}>
                  {companyData.insider_activity.net_position}
                </div>
              </div>
            </div>

            {/* Price Action */}
            <div 
              style={{
                backgroundColor: colors.white,
                border: `1px solid ${colors.gray20}`,
                borderRadius: '8px',
                padding: '28px',
              }}
            >
              <h3 style={{
                fontSize: '14px',
                fontFamily: 'Rajdhani',
                fontWeight: 500,
                color: colors.gray60,
                letterSpacing: '0.5px',
                marginBottom: '16px',
                textTransform: 'uppercase',
              }}>
                Price Action
              </h3>
              <div style={{ marginBottom: '16px' }}>
                <div style={{
                  fontSize: '12px',
                  fontFamily: 'Quicksand',
                  color: colors.gray60,
                  marginBottom: '8px',
                }}>Current Price</div>
                <div style={{
                  fontSize: '32px',
                  fontFamily: 'Rajdhani',
                  fontWeight: 700,
                  color: colors.gray100,
                }}>
                  ${companyData.price.toFixed(2)}
                </div>
              </div>
              <div style={{
                paddingTop: '16px',
                borderTop: `1px solid ${colors.gray20}`,
              }}>
                <div style={{
                  fontSize: '12px',
                  fontFamily: 'Quicksand',
                  color: colors.gray60,
                  marginBottom: '8px',
                }}>Daily Change</div>
                <div style={{
                  fontSize: '18px',
                  fontFamily: 'Rajdhani',
                  fontWeight: 600,
                  color: companyData.change >= 0 ? colors.green : colors.red,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}>
                  {companyData.change >= 0 ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                  {Math.abs(companyData.change).toFixed(2)}%
                </div>
              </div>
            </div>
          </div>

          {/* AI Summary */}
          <div 
            style={{
              backgroundColor: colors.gray20,
              border: `1px solid ${colors.gray20}`,
              borderRadius: '8px',
              padding: '28px',
              marginBottom: '48px',
            }}
          >
            <h3 style={{
              fontSize: '14px',
              fontFamily: 'Rajdhani',
              fontWeight: 500,
              color: colors.gray60,
              letterSpacing: '0.5px',
              marginBottom: '16px',
              textTransform: 'uppercase',
            }}>
              AI Analysis Summary
            </h3>
            <p style={{
              fontSize: '15px',
              fontFamily: 'Quicksand',
              color: colors.gray100,
              lineHeight: '1.6',
            }}>
              {companyData.summary}
            </p>
          </div>

          {/* Action Buttons */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '16px',
          }}>
            <button
              style={{
                backgroundColor: colors.yellow,
                border: 'none',
                borderRadius: '6px',
                padding: '16px 24px',
                fontSize: '14px',
                fontFamily: 'Quicksand',
                fontWeight: 600,
                color: colors.gray100,
                cursor: 'pointer',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => e.target.style.opacity = '0.9'}
              onMouseLeave={(e) => e.target.style.opacity = '1'}
            >
              Generate Report
            </button>
            <button
              style={{
                backgroundColor: colors.white,
                border: `1px solid ${colors.gray20}`,
                borderRadius: '6px',
                padding: '16px 24px',
                fontSize: '14px',
                fontFamily: 'Quicksand',
                fontWeight: 600,
                color: colors.gray100,
                cursor: 'pointer',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = colors.yellow;
                e.target.style.color = colors.yellow;
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = colors.gray20;
                e.target.style.color = colors.gray100;
              }}
            >
              Compare Peers
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );

  const renderPlaceholder = (title, description) => (
    <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
      <div style={{
        backgroundColor: colors.white,
        border: `1px solid ${colors.gray20}`,
        borderRadius: '8px',
        padding: '64px 32px',
        textAlign: 'center',
      }}>
        <h2 style={{
          fontSize: '28px',
          fontFamily: 'Rajdhani',
          fontWeight: 600,
          color: colors.gray100,
          letterSpacing: '0.5px',
          marginBottom: '12px',
          textTransform: 'uppercase',
        }}>
          {title}
        </h2>
        <p style={{
          fontSize: '15px',
          fontFamily: 'Quicksand',
          color: colors.gray60,
          marginBottom: '28px',
        }}>
          {description}
        </p>
        <button
          onClick={() => setCurrentView('dashboard')}
          style={{
            backgroundColor: colors.white,
            border: `1px solid ${colors.gray40}`,
            borderRadius: '6px',
            padding: '12px 24px',
            fontSize: '13px',
            fontFamily: 'Quicksand',
            fontWeight: 600,
            color: colors.gray80,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.target.style.borderColor = colors.yellow;
            e.target.style.color = colors.yellow;
          }}
          onMouseLeave={(e) => {
            e.target.style.borderColor = colors.gray40;
            e.target.style.color = colors.gray80;
          }}
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#FFFFFF',
      padding: '32px 32px 32px 32px',
      fontFamily: 'Quicksand, sans-serif',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Quicksand:wght@400;500;600;700&display=swap');
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
      
      {currentView === 'dashboard' && renderDashboard()}
      {currentView === 'company' && renderCompanyResearch()}
      {currentView === 'strategy' && renderPlaceholder('Strategy Analysis', 'Analyze how well trading strategies fit current market conditions')}
      {currentView === 'comparison' && renderPlaceholder('Peer Comparison', 'Compare companies against peers and industry benchmarks')}
      {currentView === 'news' && renderPlaceholder('News Analysis', 'Aggregated news with sentiment analysis and impact assessment')}
      {currentView === 'macro' && renderPlaceholder('Macro Context', 'Economic indicators, Fed policy impact, and market sentiment analysis')}
      {currentView === 'settings' && renderPlaceholder('Settings', 'Configure researcher preferences and API settings')}
    </div>
  );
};

export default ResearcherPage;