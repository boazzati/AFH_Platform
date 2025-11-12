import { createTheme } from '@mui/material/styles';

// PepsiCo 2025 Brand Colors
export const pepsicoBrandColors = {
  // Primary PepsiCo Colors (from 2025 rebrand)
  primary: {
    navy: '#003366',        // Deep navy blue from "pepsico" wordmark
    blue: '#0065C3',        // Classic PepsiCo blue
    lightBlue: '#42A5F5',   // Water droplet blue
  },
  
  // Secondary Colors (from new logo elements)
  secondary: {
    orange: '#FF8C42',      // Earthy orange (grain/food symbol)
    green: '#7CB342',       // Fresh green (sustainability leaf)
    red: '#E32934',         // Classic PepsiCo red (accent only)
  },
  
  // Neutral Colors
  neutral: {
    white: '#FFFFFF',
    lightGray: '#F8F9FA',
    mediumGray: '#E9ECEF',
    darkGray: '#495057',
    charcoal: '#212529',
  },
  
  // Gradient Colors for backgrounds
  gradients: {
    primary: 'linear-gradient(135deg, #003366 0%, #0065C3 100%)',
    secondary: 'linear-gradient(135deg, #FF8C42 0%, #7CB342 100%)',
    subtle: 'linear-gradient(135deg, #F8F9FA 0%, #E9ECEF 100%)',
  }
};

// PepsiCo Typography System
export const pepsicoBrandTypography = {
  fontFamily: [
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif'
  ].join(','),
  
  // Lowercase, approachable style (matching PepsiCo 2025 rebrand)
  h1: {
    fontSize: '2.5rem',
    fontWeight: 700,
    letterSpacing: '-0.02em',
    textTransform: 'none',
  },
  h2: {
    fontSize: '2rem',
    fontWeight: 600,
    letterSpacing: '-0.01em',
    textTransform: 'none',
  },
  h3: {
    fontSize: '1.75rem',
    fontWeight: 600,
    textTransform: 'none',
  },
  h4: {
    fontSize: '1.5rem',
    fontWeight: 600,
    textTransform: 'none',
  },
  h5: {
    fontSize: '1.25rem',
    fontWeight: 500,
    textTransform: 'none',
  },
  h6: {
    fontSize: '1.125rem',
    fontWeight: 500,
    textTransform: 'none',
  },
  body1: {
    fontSize: '1rem',
    lineHeight: 1.6,
  },
  body2: {
    fontSize: '0.875rem',
    lineHeight: 1.5,
  },
  button: {
    textTransform: 'none',
    fontWeight: 600,
    letterSpacing: '0.02em',
  }
};

// PepsiCo Material-UI Theme
export const pepsicoBrandTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: pepsicoBrandColors.primary.navy,
      light: pepsicoBrandColors.primary.blue,
      dark: '#001a33',
      contrastText: '#ffffff',
    },
    secondary: {
      main: pepsicoBrandColors.secondary.orange,
      light: '#ffb74d',
      dark: '#e65100',
      contrastText: '#ffffff',
    },
    success: {
      main: pepsicoBrandColors.secondary.green,
      light: '#aed581',
      dark: '#558b2f',
    },
    info: {
      main: pepsicoBrandColors.primary.lightBlue,
      light: '#81c784',
      dark: '#1976d2',
    },
    warning: {
      main: pepsicoBrandColors.secondary.orange,
    },
    error: {
      main: pepsicoBrandColors.secondary.red,
    },
    background: {
      default: pepsicoBrandColors.neutral.white,
      paper: pepsicoBrandColors.neutral.lightGray,
    },
    text: {
      primary: pepsicoBrandColors.neutral.charcoal,
      secondary: pepsicoBrandColors.neutral.darkGray,
    },
  },
  
  typography: pepsicoBrandTypography,
  
  shape: {
    borderRadius: 12, // Organic, rounded shapes (matching PepsiCo 2025 logo style)
  },
  
  components: {
    // Card components with PepsiCo styling
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 20px rgba(0, 51, 102, 0.08)',
          borderRadius: 16,
          border: `1px solid ${pepsicoBrandColors.neutral.mediumGray}`,
          background: pepsicoBrandColors.neutral.white,
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            boxShadow: '0 8px 32px rgba(0, 51, 102, 0.12)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    
    // Button components with PepsiCo styling
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 24, // Pill-shaped buttons (organic, friendly)
          textTransform: 'none',
          fontWeight: 600,
          padding: '12px 24px',
          fontSize: '1rem',
          transition: 'all 0.3s ease-in-out',
        },
        contained: {
          background: pepsicoBrandColors.gradients.primary,
          boxShadow: '0 4px 16px rgba(0, 51, 102, 0.2)',
          '&:hover': {
            boxShadow: '0 6px 24px rgba(0, 51, 102, 0.3)',
            transform: 'translateY(-1px)',
          },
        },
        outlined: {
          borderColor: pepsicoBrandColors.primary.navy,
          color: pepsicoBrandColors.primary.navy,
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2,
            backgroundColor: `${pepsicoBrandColors.primary.navy}08`,
          },
        },
      },
    },
    
    // Chip components with organic styling
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          fontWeight: 500,
          fontSize: '0.875rem',
        },
        filled: {
          backgroundColor: pepsicoBrandColors.neutral.mediumGray,
          color: pepsicoBrandColors.neutral.charcoal,
        },
        colorPrimary: {
          backgroundColor: pepsicoBrandColors.primary.navy,
          color: pepsicoBrandColors.neutral.white,
        },
        colorSecondary: {
          backgroundColor: pepsicoBrandColors.secondary.orange,
          color: pepsicoBrandColors.neutral.white,
        },
      },
    },
    
    // AppBar with PepsiCo branding
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: pepsicoBrandColors.gradients.primary,
          boxShadow: '0 2px 16px rgba(0, 51, 102, 0.1)',
        },
      },
    },
    
    // Drawer with PepsiCo styling
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: pepsicoBrandColors.neutral.white,
          borderRight: `1px solid ${pepsicoBrandColors.neutral.mediumGray}`,
          boxShadow: '4px 0 16px rgba(0, 51, 102, 0.05)',
        },
      },
    },
    
    // List items with PepsiCo interaction states
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          margin: '4px 8px',
          '&.Mui-selected': {
            background: pepsicoBrandColors.gradients.primary,
            color: pepsicoBrandColors.neutral.white,
            '& .MuiListItemIcon-root': {
              color: pepsicoBrandColors.neutral.white,
            },
            '&:hover': {
              background: pepsicoBrandColors.gradients.primary,
            },
          },
          '&:hover': {
            backgroundColor: `${pepsicoBrandColors.primary.navy}08`,
            borderRadius: 12,
          },
        },
      },
    },
    
    // Paper components
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        elevation1: {
          boxShadow: '0 2px 8px rgba(0, 51, 102, 0.08)',
        },
        elevation2: {
          boxShadow: '0 4px 16px rgba(0, 51, 102, 0.1)',
        },
        elevation3: {
          boxShadow: '0 6px 24px rgba(0, 51, 102, 0.12)',
        },
      },
    },
  },
  
  // Custom breakpoints for responsive design
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
});

// PepsiCo Business Terminology Mapping
export const pepsicoBrandTerminology = {
  // Navigation terms
  navigation: {
    'AFH Dashboard': 'growth command center',
    'Market Mapping': 'growth opportunities',
    'Playbook Generator': 'activation playbooks',
    'Execution Engine': 'partnership engine',
    'Data Integration': 'consumer insights',
    'Expert Network': 'category experts',
    'Agentic AI': 'smart assistant',
    'Predictive Analytics': 'market intelligence',
    'Outreach Automation': 'partnership activation',
    'Intelligent Matching': 'perfect partnerships',
    'Benchmarking': 'competitive edge',
  },
  
  // Business metrics
  metrics: {
    'Revenue': 'portfolio growth',
    'Partnerships': 'activations',
    'Opportunities': 'growth potential',
    'Success Rate': 'smiles delivered',
    'Market Share': 'category leadership',
    'ROI': 'growth impact',
  },
  
  // AFH Channel terminology
  channels: {
    'Restaurants': 'foodservice partners',
    'Convenience Stores': 'c-store network',
    'Vending': 'automated retail',
    'Workplace': 'office solutions',
    'Healthcare': 'wellness venues',
    'Education': 'campus dining',
  },
  
  // PepsiCo brand portfolio
  brands: {
    beverages: ['Pepsi', 'Mountain Dew', 'Gatorade', 'Aquafina', 'Tropicana'],
    snacks: ['Lay\'s', 'Doritos', 'Cheetos', 'Tostitos', 'Ruffles'],
    nutrition: ['Quaker', 'Bare', 'Health Warrior', 'PopCorners'],
  }
};

export default pepsicoBrandTheme;
