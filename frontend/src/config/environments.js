const environments = {
    development: {
      apiUrl: 'http://localhost:5000',
      name: 'Development'
    },
    qa: {
      apiUrl: 'http://localhost:5000',
      name: 'QA'
    },
    production: {
      apiUrl: 'http://52.247.247.121:5000', 
      name: 'Production'
    }
  };
  
  export const getEnvironmentConfig = () => {
    const env = import.meta.env.VITE_APP_ENV || 'development';
    return environments[env];
  };