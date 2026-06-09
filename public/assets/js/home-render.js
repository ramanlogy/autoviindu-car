/**
 * Premium homepage layout — included from app.js renderHome()
 * Returns HTML string for #app-root
 */
window.buildHomePageHTML = function buildHomePageHTML(ctx) {
  const { db, evCars, carCard, BRANDS, BUDGETS, HERO_SLIDES, IC } = ctx;
  const featured = [...db].filter(c => c.isFeatured || c.isBestSeller).slice(0, 8);
  const gridCars = featured.length >= 4 ? featured : db.slice(0, 8);
  const trending = [...db].sort((a, b) => (b.reviews || 0) - (a.reviews || 0)).slice(0, 10);
  const brands = BRANDS.slice(0, 12);

  const categories = [
    {
      label: 'SUV',
      filter: 'suv',
      svg: `<svg viewBox="0 0 110 110" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M21.164,55.966c-5.021,0-9.092,4.07-9.092,9.092s4.071,9.092,9.092,9.092s9.092-4.07,9.092-9.092S26.186,55.966,21.164,55.966z M21.164,69.316c-2.352,0-4.259-1.906-4.259-4.259s1.907-4.259,4.259-4.259s4.259,1.906,4.259,4.259S23.516,69.316,21.164,69.316z"/>
      <path d="M85.664,55.966c-5.021,0-9.092,4.07-9.092,9.092s4.07,9.092,9.092,9.092s9.093-4.07,9.093-9.092S90.686,55.966,85.664,55.966z M85.664,69.316c-2.352,0-4.259-1.906-4.259-4.259s1.907-4.259,4.259-4.259s4.259,1.906,4.259,4.259S88.016,69.316,85.664,69.316z"/>
      <path d="M107.934,59.775c0-0.227,0.265-1.361,0.228-1.779c-0.037-0.416-1.06-2.232-1.247-2.27s-0.04-2.271-0.002-3.595s-0.605-1.93-0.605-1.93s-0.038-0.983-0.151-1.665l-0.263-1.574c0-0.207-2.44-1.714-2.44-1.714l-4.985-5.037l1.143-0.675l-0.467-0.728c0,0-0.208,0-1.039,0.104c-0.033,0.004-0.059,0.008-0.079,0.012c-0.083-0.084-1.054-0.367-6.879-1.103c-9.451-1.194-27.265-1.973-28.304-1.973s-8.152,0.312-10.956,0.883s-10.125,3.738-11.216,4.361s-9.665,5.144-9.665,5.144s-5.712,0.416-12.047,1.246S8.676,49.509,7.793,49.873s-2.804,1.402-2.908,1.714s-0.675,2.597-0.883,3.012s-1.454,2.597-1.454,2.597l0.016,2.391l0.509,0.758l0.038,2.271l-0.378,0.605c0,0-0.378-0.531,0,1.324c0.378,1.854,2.99,2.535,2.99,2.535l3.179,0.379l0.189,0.68l1.635-0.014c-0.276-0.947-0.432-1.948-0.432-2.986c0-5.881,4.768-10.649,10.649-10.649s10.649,4.768,10.649,10.649c0,0.977-0.142,1.916-0.388,2.814l0.365-0.004h21.305h22.473c-0.245-0.896-0.387-1.836-0.387-2.811c0-5.881,4.768-10.649,10.648-10.649c5.882,0,10.649,4.768,10.649,10.649c0,0.748-0.078,1.477-0.225,2.18l2.705-0.088c0,0,3.292-0.379,4.654-0.568s2.232-0.643,3.178-1.514c0.945-0.869,1.594-3.746,1.594-3.746S107.934,60.002,107.934,59.775z M32.191,47.14c1.203-0.635,8.478-4.474,9.479-5.045c1.091-0.623,8.413-3.79,11.216-4.361s9.917-0.883,10.956-0.883c0.123,0,0.487,0.011,1.04,0.033l-6.441,9.266L32.191,47.14z M85.19,45.14l-24.639,0.93l6.081-9.113c4.896,0.22,15.124,0.77,22.562,1.532L85.19,45.14z"/>
    </svg>`
    },
    {
      label: 'Crossover',
      filter: 'crossover',
      svg: `<svg viewBox="0 0 50 50" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M48.8,23.8c-0.1-1-0.4-1.9-1-2.7c-1.5-1.8-2.4-4.2-5.3-4.6c-4.7-0.6-16.1-1.5-19.8,0.2c-12.7,5.9-6.9,3.7-19.5,6.9c-0.6,0.2-1.1,0.6-1.4,1.1c-0.8,1.5-1.1,3.8-0.2,5.2C2,30.6,2.7,31,3.6,31h0.9c-0.1-0.4-0.1-0.9-0.1-1.3c0-3.6,3-6.6,6.6-6.6c3.6,0,6.6,3,6.6,6.6c0,0.4,0,0.9-0.1,1.3h15.1c-0.1-0.4-0.1-0.9-0.1-1.3c0-3.6,3-6.6,6.6-6.6s6.6,3,6.6,6.6c0,0.4,0,0.8-0.1,1.2c0.9-0.2,1.8-0.7,2.4-1.4c0.8-0.9,1.3-2.1,1.2-3.4L48.8,23.8z M27,21.3l-8.2,0.6c-0.6,0-1.1-0.1-1.6-0.4l6.3-3c0.6-0.3,1.1-0.4,3.5-0.6V21.3z M34,20.8l-5,0.4v-3.4c1.7-0.1,3.4-0.1,5,0V20.8z M40.3,19.7c-0.1,0.4-0.4,0.6-0.8,0.7L36,20.6v-2.8c1.6,0.1,3.1,0.3,4.6,0.4L40.3,19.7z"/>
      <ellipse cx="10.9" cy="29.7" rx="4.6" ry="4.6"/>
      <path d="M43.5,29.7c0,2.5-2.1,4.6-4.6,4.6c-2.5,0-4.6-2.1-4.6-4.6s2.1-4.6,4.6-4.6C41.5,25.1,43.5,27.2,43.5,29.7z"/>
    </svg>`
    },
    {
      label: 'Sedan',
      filter: 'sedan',
      svg: `<svg viewBox="0 0 98.967 98.967" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.275,52.156c-4.124,0-7.468,3.343-7.468,7.468c0,0.318,0.026,0.631,0.066,0.938c0.463,3.681,3.596,6.528,7.401,6.528c3.908,0,7.112-3.004,7.437-6.83c0.017-0.209,0.031-0.422,0.031-0.637C24.743,55.499,21.4,52.156,17.275,52.156z M13.537,56.81l1.522,1.523c-0.118,0.203-0.211,0.422-0.271,0.656h-2.146C12.752,58.177,13.063,57.435,13.537,56.81z M12.632,60.282h2.163c0.061,0.23,0.151,0.448,0.271,0.648l-1.526,1.525C13.067,61.835,12.749,61.093,12.632,60.282z M16.629,64.263c-0.809-0.113-1.544-0.43-2.166-0.899l1.518-1.519c0.2,0.117,0.419,0.203,0.648,0.263V64.263z M16.629,57.14c-0.235,0.062-0.455,0.154-0.66,0.275l-1.521-1.521c0.625-0.475,1.367-0.789,2.181-0.902V57.14z M17.922,54.99c0.814,0.113,1.557,0.429,2.181,0.903l-1.52,1.521c-0.204-0.121-0.426-0.213-0.66-0.275L17.922,54.99z M17.922,64.261v-2.152c0.23-0.061,0.447-0.146,0.647-0.264l1.519,1.519C19.466,63.833,18.73,64.148,17.922,64.261z M21.014,62.462l-1.531-1.533c0.12-0.201,0.217-0.416,0.278-0.646h2.146C21.793,61.091,21.488,61.839,21.014,62.462z M19.764,58.989c-0.061-0.234-0.153-0.453-0.271-0.656l1.524-1.523c0.471,0.625,0.782,1.367,0.894,2.18H19.764z M79.284,52.156c-4.124,0-7.468,3.343-7.468,7.468c0,0.318,0.026,0.631,0.066,0.938c0.463,3.681,3.596,6.528,7.4,6.528c3.908,0,7.112-3.004,7.438-6.83c0.017-0.209,0.031-0.422,0.031-0.637C86.753,55.499,83.409,52.156,79.284,52.156z M75.546,56.81l1.521,1.523c-0.118,0.203-0.211,0.422-0.271,0.656H74.65C74.761,58.177,75.072,57.435,75.546,56.81z M74.642,60.282h2.163c0.061,0.23,0.151,0.448,0.271,0.648l-1.525,1.525C75.076,61.835,74.757,61.093,74.642,60.282z M78.638,64.263c-0.809-0.113-1.544-0.43-2.166-0.899l1.518-1.519c0.2,0.117,0.419,0.203,0.648,0.263V64.263z M78.638,57.14c-0.235,0.062-0.455,0.154-0.66,0.275l-1.521-1.521c0.625-0.475,1.366-0.789,2.181-0.902V57.14z M79.932,54.99c0.814,0.113,1.557,0.429,2.181,0.903l-1.521,1.521c-0.204-0.121-0.426-0.215-0.66-0.275V54.99z M79.932,64.261v-2.152c0.23-0.061,0.447-0.146,0.647-0.264l1.519,1.519C81.476,63.833,80.739,64.148,79.932,64.261z M83.023,62.462l-1.531-1.531c0.12-0.202,0.218-0.416,0.278-0.647h2.146C83.802,61.091,83.498,61.839,83.023,62.462z M81.773,58.989c-0.061-0.234-0.152-0.453-0.271-0.656l1.523-1.523c0.472,0.625,0.782,1.367,0.895,2.18H81.773z M97.216,48.29v-5.526c0-0.889-0.646-1.642-1.524-1.779c-2.107-0.33-5.842-0.953-7.52-1.47c-2.406-0.742-11.702-4.678-14.921-5.417c-3.22-0.739-17.738-4.685-31.643,0.135c-2.353,0.815-12.938,5.875-19.162,8.506c-1.833,0.04-19.976,3.822-20.942,6.414c-0.966,2.593-1.269,3.851-1.447,4.509c-0.178,0.658,0,3.807,1.348,6c1.374,0.777,4.019,1.299,7.077,1.649c-0.035-0.187-0.073-0.371-0.097-0.56c-0.053-0.404-0.078-0.773-0.078-1.125c0-4.945,4.022-8.969,8.968-8.969s8.968,4.023,8.968,8.969c0,0.254-0.017,0.506-0.036,0.754c-0.047,0.555-0.147,1.094-0.292,1.613c0.007,0,0.024,0,0.024,0l44.516-0.896c-0.02-0.115-0.046-0.229-0.061-0.346c-0.053-0.402-0.078-0.772-0.078-1.125c0-4.945,4.022-8.968,8.968-8.968c4.946,0,8.969,4.022,8.969,8.968c0,0.019-0.002,0.035-0.003,0.053l0.19-0.016l7.611-1.433c0,0,2.915-1.552,2.915-5.822C98.967,49.56,97.216,48.29,97.216,48.29z M53.057,43.051L36.432,43.56c0.306-2.491-1.169-3.05-1.169-3.05c6.609-5.999,19.929-6.202,19.929-6.202L53.057,43.051z M71.715,42.29l-15.15,0.509l1.373-8.49c7.83-0.102,12.303,1.626,12.303,1.626l2.237,3.61L71.715,42.29z M80.256,42.238h-4.221l-4.22-5.795c3.166,1.26,5.7,2.502,7.209,3.287C79.94,40.206,80.44,41.223,80.256,42.238z"/>
    </svg>`
    },
    {
      label: 'Electric',
      filter: 'electric',
      svg: `<svg viewBox="0 0 74.955 29.927" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M68.697,25.833c0.04-0.117,0.074-0.236,0.105-0.357c0.017-0.055,0.03-0.105,0.045-0.162c0.021-0.102,0.045-0.205,0.064-0.311c0.017-0.092,0.03-0.182,0.038-0.273c0.014-0.08,0.025-0.16,0.033-0.242c0.018-0.178,0.028-0.363,0.028-0.547c-0.006-3.307-2.681-5.98-5.986-5.986c-3.305,0.006-5.98,2.68-5.987,5.986c0,0.184,0.011,0.369,0.028,0.547c0.008,0.082,0.021,0.162,0.03,0.242c0.012,0.092,0.027,0.182,0.041,0.273c0.021,0.105,0.046,0.209,0.067,0.311c0.013,0.057,0.025,0.107,0.042,0.162c0.032,0.121,0.062,0.24,0.104,0.357c0,0.002,0,0.002,0,0.004l0,0c0.796,2.375,3.031,4.086,5.674,4.09c2.642-0.004,4.877-1.715,5.672-4.09l0,0C68.697,25.835,68.697,25.835,68.697,25.833z"/>
      <path d="M14.047,17.955c-3.308,0.006-5.98,2.68-5.988,5.986c0.002,0.736,0.142,1.441,0.388,2.096c0.851,2.268,3.033,3.887,5.6,3.891c2.568-0.004,4.746-1.623,5.598-3.891c0.246-0.654,0.386-1.359,0.388-2.096C20.027,20.634,17.354,17.96,14.047,17.955z"/>
      <path d="M71.389,10.68c-4.437-3.543-6.607-6.354-7.55-7.814c1.15,0,1.683-0.408,1.774-0.531c0.355-0.495-15.896-3.345-29.295-1.588c-2.331,0.305-7.435,2.028-14.909,6.566C17.271,9.823,10.349,8.23,5.637,11.834c-4.29,3.281-5.667,5.453-5.545,7.054c0.158,2.025,1.018,2.559,0.093,3.482c-1.307,1.305,4.684,3.512,6.653,3.512h0.461c-0.175-0.617-0.276-1.266-0.276-1.941c0-3.879,3.144-7.023,7.024-7.023c3.876,0,7.023,3.145,7.023,7.023c0,0.676-0.102,1.324-0.28,1.941h3.421c1.199,0,13.862-0.186,13.862-0.186h18.159C56.089,25.134,56,24.548,56,23.941c0.002-3.881,3.146-7.023,7.025-7.023s7.02,3.143,7.02,7.023c0,0.607-0.083,1.193-0.227,1.756h0.786c0,0,1.848-1.664,2.678-1.664C74.855,24.033,76.657,14.885,71.389,10.68z M40.14,23.08l1.546-8.381h-5.019l8.366-11.735l-1.545,8.381h5.018L40.14,23.08z"/>
    </svg>`
    },
    {
      label: 'Microvan',
      filter: 'van',
      svg: `<svg viewBox="0 0 99.442 99.443" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M19.097,54.071c-4.175,0-7.561,3.383-7.561,7.56c0,0.324,0.026,0.641,0.066,0.951c0.469,3.729,3.642,6.611,7.494,6.611c3.959,0,7.202-3.042,7.53-6.916c0.018-0.214,0.033-0.428,0.033-0.646C26.66,57.454,23.275,54.071,19.097,54.071z M15.31,58.782l1.543,1.543c-0.121,0.206-0.214,0.429-0.274,0.665h-2.174C14.518,60.165,14.833,59.415,15.31,58.782z M14.397,62.298h2.189c0.062,0.233,0.153,0.454,0.274,0.656L15.314,64.5C14.838,63.871,14.513,63.119,14.397,62.298z M18.443,66.328c-0.818-0.112-1.564-0.434-2.193-0.908l1.537-1.538c0.202,0.118,0.424,0.205,0.656,0.266V66.328z M18.443,59.116c-0.238,0.062-0.461,0.157-0.668,0.279l-1.541-1.541c0.633-0.48,1.385-0.8,2.209-0.913V59.116z M19.752,56.941c0.826,0.113,1.577,0.433,2.209,0.914l-1.54,1.54c-0.207-0.122-0.43-0.218-0.669-0.279V56.941z M19.752,66.328v-2.182c0.233-0.061,0.454-0.147,0.657-0.268l1.538,1.54C21.317,65.894,20.572,66.214,19.752,66.328z M22.885,64.504l-1.551-1.551c0.12-0.203,0.22-0.42,0.282-0.655h2.172C23.673,63.119,23.364,63.875,22.885,64.504z M21.617,60.99c-0.06-0.236-0.153-0.459-0.274-0.665l1.543-1.543c0.478,0.633,0.792,1.383,0.905,2.208H21.617z M83.965,54.071c-4.176,0-7.561,3.383-7.561,7.56c0,0.324,0.025,0.641,0.065,0.951c0.468,3.729,3.643,6.611,7.494,6.611c3.958,0,7.201-3.042,7.53-6.916c0.018-0.214,0.031-0.428,0.031-0.646C91.526,57.454,88.142,54.071,83.965,54.071z M80.177,58.782l1.543,1.543c-0.12,0.206-0.214,0.429-0.273,0.665h-2.175C79.385,60.165,79.7,59.415,80.177,58.782z M79.265,62.298h2.19c0.062,0.233,0.152,0.454,0.272,0.656L80.182,64.5C79.705,63.871,79.38,63.119,79.265,62.298z M83.31,66.328c-0.818-0.112-1.563-0.434-2.192-0.908l1.537-1.538c0.201,0.118,0.424,0.205,0.655,0.266V66.328z M83.31,59.116c-0.237,0.062-0.461,0.157-0.669,0.279L81.1,57.854c0.634-0.48,1.385-0.8,2.209-0.913L83.31,59.116z M84.62,56.941c0.824,0.113,1.576,0.433,2.209,0.914l-1.541,1.54c-0.207-0.122-0.431-0.218-0.668-0.279V56.941z M84.62,66.328v-2.182c0.231-0.061,0.454-0.147,0.655-0.268l1.538,1.54C86.184,65.894,85.438,66.214,84.62,66.328z M87.752,64.504l-1.551-1.551c0.12-0.203,0.22-0.42,0.281-0.655h2.174C88.54,63.119,88.23,63.875,87.752,64.504z M86.483,60.99c-0.06-0.236-0.152-0.459-0.272-0.665l1.542-1.543c0.478,0.633,0.792,1.383,0.906,2.208H86.483z M99.091,47.939c-0.056-1.67-0.516-3.301-1.339-4.754l-5.43-9.581c-0.89-1.569-2.521-2.573-4.322-2.664c-9.1-0.456-37.002-1.618-45.786,0.744C36.272,33.283,21.278,43.14,21.278,43.14S4.781,45.695,1.634,53.219c0,0-1.358,0.793-1.605,2.826c-0.127,1.046,0.183,2.634,0.525,3.965c0.375,1.456,1.582,2.552,3.067,2.783l7.16,1.122c-0.107-0.391-0.196-0.788-0.248-1.198c-0.045-0.354-0.075-0.716-0.075-1.087c0-4.763,3.875-8.637,8.639-8.637c4.765,0,8.64,3.874,8.64,8.637c0,0.249-0.016,0.493-0.036,0.735c-0.072,0.844-0.268,1.651-0.567,2.408l0.842,0.045l47.568-1.287c-0.061-0.268-0.109-0.538-0.145-0.814c-0.046-0.354-0.074-0.716-0.074-1.087c0-4.763,3.875-8.637,8.638-8.637c4.765,0,8.64,3.874,8.64,8.637c0,0.249-0.016,0.493-0.037,0.735c-0.013,0.16-0.041,0.315-0.062,0.473L96.609,62c1.693-0.346,2.891-1.86,2.831-3.589L99.091,47.939z M71.715,32.71l1.093,10.911l-16.774,0.686V32.655C60.938,32.542,66.536,32.593,71.715,32.71z M29.387,45.087l-1.659,0.093c-0.451,0.025-0.864-0.249-1.016-0.675c-0.152-0.424-0.005-0.897,0.358-1.164c0.975-0.712,2.169-1.563,3.499-2.462v2.784C29.759,44.348,29.387,45.087,29.387,45.087z M33.498,42.533c-0.105,0.004-0.191,0.03-0.291,0.04V39.15c3.382-2.144,7.215-4.273,10.511-5.34c1.5-0.485,4.236-0.795,7.636-0.98v11.668l-14.412,0.589C36.942,45.087,36.442,42.423,33.498,42.533z M91.768,41.475c-0.503,0.874-1.419,1.429-2.426,1.471L77.49,43.43l-1.062-10.594c4.898,0.149,8.99,0.333,11.063,0.445c0.959,0.051,1.824,0.604,2.271,1.454l2.057,3.903C92.29,39.531,92.27,40.603,91.768,41.475z"/>
    </svg>`
    },
    {
      label: 'Hatchback',
      filter: 'hatchback',
      svg: `<svg viewBox="0 -39.69 122.88 122.88" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M103.94,23.97c5.39,0,9.76,4.37,9.76,9.76c0,5.39-4.37,9.76-9.76,9.76c-5.39,0-9.76-4.37-9.76-9.76 C94.18,28.34,98.55,23.97,103.94,23.97L103.94,23.97z M23,29.07v3.51h3.51C26.09,30.86,24.73,29.49,23,29.07L23,29.07z M26.52,34.87H23v3.51C24.73,37.97,26.09,36.6,26.52,34.87L26.52,34.87z M20.71,38.39v-3.51H17.2 C17.62,36.6,18.99,37.96,20.71,38.39L20.71,38.39z M17.2,32.59h3.51v-3.51C18.99,29.49,17.62,30.86,17.2,32.59L17.2,32.59z M105.09,29.07v3.51h3.51C108.18,30.86,106.82,29.49,105.09,29.07L105.09,29.07z M108.6,34.87h-3.51v3.51 C106.82,37.97,108.18,36.6,108.6,34.87L108.6,34.87z M102.8,38.39v-3.51h-3.51C99.71,36.6,101.07,37.96,102.8,38.39L102.8,38.39z M99.28,32.59h3.51v-3.51C101.07,29.49,99.71,30.86,99.28,32.59L99.28,32.59z M49.29,12.79c-1.54-0.35-3.07-0.35-4.61-0.28 C56.73,6.18,61.46,2.07,75.57,2.9l-1.94,12.87L50.4,16.65c0.21-0.61,0.33-0.94,0.37-1.55C50.88,13.36,50.86,13.15,49.29,12.79 L49.29,12.79z M79.12,3.13L76.6,15.6l24.13-0.98c2.48-0.1,2.91-1.19,1.41-3.28c-0.68-0.95-1.44-1.89-2.31-2.82 C93.59,1.86,87.38,3.24,79.12,3.13L79.12,3.13z M0.46,27.28H1.2c0.46-2.04,1.37-3.88,2.71-5.53c2.94-3.66,4.28-3.2,8.65-3.99 l24.46-4.61c5.43-3.86,11.98-7.3,19.97-10.2C64.4,0.25,69.63-0.01,77.56,0c4.54,0.01,9.14,0.28,13.81,0.84 c2.37,0.15,4.69,0.47,6.97,0.93c2.73,0.55,5.41,1.31,8.04,2.21l9.8,5.66c2.89,1.67,3.51,3.62,3.88,6.81l1.38,11.78h1.43v6.51 c-0.2,2.19-1.06,2.52-2.88,2.52h-2.37c0.92-20.59-28.05-24.11-27.42,1.63H34.76c3.73-17.75-14.17-23.91-22.96-13.76 c-2.67,3.09-3.6,7.31-3.36,12.3H2.03c-0.51-0.24-0.91-0.57-1.21-0.98c-1.05-1.43-0.82-5.74-0.74-8.23 C0.09,27.55-0.12,27.28,0.46,27.28L0.46,27.28z M21.86,23.97c5.39,0,9.76,4.37,9.76,9.76c0,5.39-4.37,9.76-9.76,9.76 c-5.39,0-9.76-4.37-9.76-9.76C12.1,28.34,16.47,23.97,21.86,23.97L21.86,23.97z"/>
    </svg>`
    },
    {
      label: 'Pickup',
      filter: 'pickup',
      svg: `<svg viewBox="0 0 99.288 99.288" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.794,50.41c-4.363,0-7.902,3.535-7.902,7.899c0,0.34,0.027,0.67,0.07,0.994c0.49,3.896,3.806,6.91,7.832,6.91c4.139,0,7.527-3.179,7.871-7.229c0.018-0.225,0.034-0.446,0.034-0.676C25.699,53.945,22.161,50.41,17.794,50.41z M13.836,55.333l1.613,1.612c-0.126,0.216-0.225,0.447-0.287,0.695h-2.271C13.008,56.779,13.337,55.995,13.836,55.333z M12.882,59.008h2.288c0.065,0.244,0.161,0.476,0.287,0.688l-1.616,1.613C13.343,60.652,13.003,59.866,12.882,59.008z M17.11,63.221c-0.854-0.117-1.635-0.453-2.292-0.949l1.607-1.607c0.21,0.123,0.442,0.214,0.685,0.276V63.221z M17.11,55.682c-0.248,0.064-0.48,0.164-0.698,0.291l-1.609-1.609c0.66-0.503,1.447-0.835,2.308-0.955L17.11,55.682z M18.479,53.409c0.863,0.12,1.648,0.452,2.31,0.956l-1.609,1.608c-0.217-0.127-0.45-0.227-0.7-0.291L18.479,53.409z M18.479,63.221v-2.28c0.244-0.063,0.475-0.154,0.687-0.279l1.606,1.61C20.115,62.766,19.336,63.102,18.479,63.221z M21.753,61.313l-1.62-1.619c0.125-0.213,0.229-0.439,0.294-0.686h2.271C22.578,59.866,22.254,60.657,21.753,61.313z M20.428,57.641c-0.062-0.248-0.16-0.479-0.285-0.695l1.611-1.612c0.5,0.661,0.829,1.445,0.947,2.308H20.428z M74.758,50.41c-4.363,0-7.901,3.535-7.901,7.899c0,0.34,0.026,0.67,0.067,0.994c0.49,3.896,3.808,6.91,7.834,6.91c4.139,0,7.526-3.179,7.87-7.229c0.02-0.225,0.034-0.446,0.034-0.676C82.662,53.945,79.124,50.41,74.758,50.41z M70.799,55.333l1.613,1.612c-0.126,0.216-0.224,0.447-0.287,0.695h-2.271C69.971,56.779,70.301,55.995,70.799,55.333z M69.846,59.008h2.288c0.064,0.244,0.16,0.476,0.286,0.688l-1.616,1.613C70.308,60.652,69.967,59.866,69.846,59.008z M74.074,63.221c-0.855-0.117-1.635-0.453-2.293-0.949l1.606-1.607c0.211,0.123,0.443,0.214,0.687,0.276V63.221z M74.074,55.682c-0.25,0.064-0.482,0.164-0.699,0.291l-1.608-1.609c0.66-0.503,1.446-0.835,2.309-0.955L74.074,55.682z M75.441,53.409c0.862,0.12,1.647,0.452,2.31,0.956l-1.608,1.608c-0.218-0.127-0.45-0.227-0.7-0.291L75.441,53.409z M75.441,63.221v-2.28c0.244-0.063,0.475-0.154,0.687-0.279l1.607,1.61C77.078,62.766,76.299,63.102,75.441,63.221z M78.716,61.313l-1.62-1.619c0.125-0.213,0.229-0.439,0.295-0.686h2.271C79.54,59.866,79.217,60.657,78.716,61.313z M77.392,57.641c-0.062-0.248-0.16-0.479-0.285-0.695l1.611-1.612c0.499,0.661,0.828,1.445,0.945,2.308H77.392z M97.999,52.649H96.44l-0.4-9.369c-0.024-0.578-0.504-1.032-1.082-1.027L73.422,42.45v-7.78c0-0.724-0.587-1.31-1.311-1.31h-1.027c-0.723,0-1.31,0.586-1.31,1.31v7.814l-2.86,0.026l-0.574-6.886c-0.12-1.44-1.324-2.549-2.77-2.549H37.414c-0.913,0-1.79,0.353-2.448,0.984l-8.782,8.428L9.373,44.261c-2.33,0.245-4.463,1.421-5.915,3.261l-1.731,2.194c-1.316,0.813-1.975,2.373-1.64,3.885l0.521,2.356c0.225,1.021,1.023,1.815,2.044,2.036l5.737,1.248c-0.033-0.322-0.064-0.639-0.064-0.932c0-5.221,4.248-9.468,9.47-9.468c5.224,0,9.473,4.248,9.473,9.468c0,0.272-0.018,0.539-0.039,0.806c-0.006,0.069-0.02,0.136-0.027,0.204h38.157c-0.04-0.354-0.07-0.692-0.07-1.01c0-5.221,4.248-9.468,9.471-9.468c5.225,0,9.473,4.248,9.473,9.468c0,0.272-0.019,0.539-0.039,0.806c-0.006,0.069-0.021,0.136-0.027,0.204h4.808l4.356-2.401h4.672c0.711,0,1.287-0.575,1.287-1.286v-1.695C99.286,53.223,98.71,52.649,97.999,52.649z M33.071,43.002c0,0,0.559-1.347,0-2.89l3.467-4.299c0.198-0.245,0.496-0.388,0.81-0.388h10.375v7.576L33.071,43.002z M51.563,43.002v-7.576h9.415c0.558,0,1.017,0.44,1.04,0.997l0.273,6.579H51.563z"/>
    </svg>`
    },
  ];
  const pill = c => `<button type="button" class="home-pill" onclick="AV.goTo('cars',{filter:'${c.filter}'})">${c.svg}${c.label}</button>`;
  const brandCard = b => `<div class="brand-card" onclick="AV.goTo('cars',{brand:'${b.name}'})"><div class="brand-logo" style="background:#f8faf9;padding:6px"><img src="${b.logo}" alt="${b.name}" loading="lazy" style="width:100%;height:100%;object-fit:contain" onerror="this.style.display='none'"></div><span class="brand-name">${b.name}</span><span class="brand-count">${b.count}</span></div>`;

  const budgetCard = b => `<div class="budget-card" onclick="AV.goTo('cars')"><div class="budget-bg" style="background-image:url('${b.bg}')"></div><div class="budget-overlay" style="background:${b.overlay}"></div><div class="budget-content"><div class="budget-label">${b.label}</div><div class="budget-count">${b.count}</div></div></div>`;

  const svc = (href, title, desc, icon) => `<div class="svc-card" onclick="window.location.href='${href}'"><div class="svc-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">${icon}</svg></div><div class="svc-name">${title}</div><div class="svc-desc">${desc}</div><span class="svc-learn">Learn more →</span></div>`;

  const tool = (href, title, desc, icon, onclick) => {
    const click = onclick ? ` onclick="${onclick};return false;"` : '';
    return `<a class="home-tool-card" href="${href}"${click}><div class="home-tool-card__icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">${icon}</svg></div><div class="home-tool-card__title">${title}</div><div class="home-tool-card__desc">${desc}</div></a>`;
  };

  return `
<div class="home-page">

  <!-- Hero -->
  <div class="hero" id="hero">
    <div class="hero-slides" id="hero-slides">
      ${HERO_SLIDES.map((s, i) => `
      <div class="hero-slide" data-idx="${i}">
        <div class="slide-bg" style="background-image:url('${s.bg}')"></div>
        <div class="wrap slide-content">
          <div class="slide-badge"><span class="dot"></span>${s.badge}</div>
          <h1 class="slide-title">${s.title}</h1>
          <p class="slide-sub">${s.sub}</p>
          <div class="offer-pill" style="color:#fff">${s.offer.icon}<strong>${s.offer.label}</strong> — ${s.offer.val}</div>
          <div class="slide-actions">
            <button class="slide-action-primary" onclick="AV.openDetail('${s.slug}')">View Details</button>
            <button class="slide-action-ghost" onclick="AV.goTo('cars')">Browse All Cars</button>
          </div>
        </div>
      </div>`).join('')}
    </div>
    <button class="hero-prev" onclick="AV.heroNav(-1)" aria-label="Previous"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="16" height="16"><polyline points="15 18 9 12 15 6"/></svg></button>
    <button class="hero-next" onclick="AV.heroNav(1)" aria-label="Next"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="16" height="16"><polyline points="9 18 15 12 9 6"/></svg></button>
    <div class="hero-dots" id="hero-dots">${HERO_SLIDES.map((_, i) => `<div class="hero-dot ${i === 0 ? 'active' : ''}" onclick="AV.heroGo(${i})"></div>`).join('')}</div>
    <div class="hero-progress" id="hero-progress"></div>
  </div>

  <div class="home-discover">
  <div class="wrap">
    <div class="home-cat-header">
      <span class="home-cat-eyebrow">Browse by body type</span>
      <h2 class="home-cat-title">What Car you  <em>Want to Own?</em></h2>
    </div>
    <div class="home-discover__scroll">${categories.map(pill).join('')}</div>
  </div>
</div>

  <!-- Search -->
  <section class="home-section home-search-section">
    <div class="wrap home-section__inner">
      <div class="search-widget">
        <div class="sw-tabs">
          <div class="sw-tab active">New Cars</div>
          <div class="sw-tab" onclick="AV.goTo('used')">Used Cars</div>
          <div class="sw-tab" onclick="AV.goTo('cars',{filter:'electric'})">Electric</div>
          <div class="sw-tab" onclick="AV.goTo('compare')">Compare</div>
        </div>
        <div class="sw-body">
          <div class="sw-grid">
            <div class="sw-field"><label>Brand</label><select class="sw-select" id="sw-brand"><option value="">All Brands</option>${[...new Set(db.map(c => c.brand))].map(b => `<option>${b}</option>`).join('')}</select></div>
            <div class="sw-field"><label>Budget</label><select class="sw-select" id="sw-budget"><option value="">Any Budget</option><option value="15">Under Rs. 15L</option><option value="25">Rs. 15L – 25L</option><option value="40">Rs. 25L – 40L</option><option value="60">Rs. 40L – 60L</option><option value="100">Rs. 60L – 1Cr</option><option value="999">Above Rs. 1Cr</option></select></div>
            <div class="sw-field"><label>Fuel</label><select class="sw-select" id="sw-fuel"><option value="">All Types</option><option value="petrol">Petrol</option><option value="diesel">Diesel</option><option value="electric">Electric</option><option value="hybrid">Hybrid</option></select></div>
            <button class="sw-btn" onclick="AV.swSearch()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="15" height="15"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>Search</button>
          </div>
        </div>
        <div class="sw-popular"><span class="sw-popular-label">Popular:</span>${['Creta', 'Swift', 'Seltos', 'Fortuner', 'Atto 3', 'Grand Vitara'].map(t => `<span class="sw-pop-tag" onclick="AV.goTo('cars',{q:'${t}'})">${t}</span>`).join('')}</div>
      </div>
    </div>
  </section>

  <!-- New Cars -->
  <section class="home-section home-section--white" id="home-new-cars">
    <div class="wrap home-section__inner">
      <div class="home-head">
        <div class="home-head__left">
          <span class="home-eyebrow">New in Nepal</span>
          <h2 class="home-title">Featured New Cars</h2>
          <p class="home-sub">${db.length} models with full specs, variants, and EMI estimates.</p>
        </div>
        <button type="button" class="home-link" onclick="AV.goTo('cars')">View all ${IC.chevR || '→'}</button>
      </div>
      <div class="home-chips filter-chips" id="home-chips">${['All', 'Electric', 'Hybrid', 'SUV', 'Sedan'].map((t, i) => `<span class="chip ${i === 0 ? 'active' : ''}" onclick="AV.homeFilter('${t}',this)">${t}</span>`).join('')}</div>
      <div class="home-grid cars-grid" id="home-grid">${gridCars.map(carCard).join('')}</div>
    </div>
  </section>

  <!-- Trending -->
  <section class="home-section home-section--muted">
    <div class="wrap home-section__inner">
      <div class="home-head">
        <div class="home-head__left">
          <span class="home-eyebrow">Most viewed</span>
          <h2 class="home-title">Trending Now</h2>
          <p class="home-sub">What buyers in Nepal are researching this week.</p>
        </div>
        <button type="button" class="home-link" onclick="AV.goTo('cars')">See all ${IC.chevR || '→'}</button>
      </div>
      <div class="home-carousel car-carousel">${trending.map(carCard).join('')}</div>
    </div>
  </section>

  <!-- Brands -->
  <section class="home-section home-section--white">
    <div class="wrap home-section__inner">
      <div class="home-head">
        <div class="home-head__left">
          <span class="home-eyebrow">Manufacturers</span>
          <h2 class="home-title">Shop by Brand</h2>
        </div>
        <button type="button" class="home-link" onclick="AV.goTo('cars')">All brands</button>
      </div>
      <div class="home-brands brands-grid">${brands.map(brandCard).join('')}</div>
    </div>
  </section>

  <!-- Smart tools -->
  <section class="home-section">
    <div class="wrap home-section__inner">
      <div class="home-head">
        <div class="home-head__left">
          <span class="home-eyebrow">Plan your purchase</span>
          <h2 class="home-title">Tools &amp; Calculators</h2>
          <p class="home-sub">Make confident decisions before you visit a showroom.</p>
        </div>
      </div>
      <div class="home-tools">
        ${tool('whatcarcanyouaffoard.html', 'What can you afford?', 'Match your budget to the right cars in Nepal.', '<path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>')}
        ${tool('caremi.html', 'EMI Calculator', 'Estimate monthly payments with down payment and tenure.', '<rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="16" y2="10"/>')}
        ${tool('#', 'Compare Cars', 'Side-by-side specs, prices, and variants.', '<path d="M18 20V10M12 20V4M6 20v-6"/>', 'AV.goTo(\'compare\')')}
        ${tool('chargingstation.html', 'EV Charging Map', 'Find charging stations across Nepal.', '<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>')}
      </div>
    </div>
  </section>

  <!-- Budget -->
  <section class="home-section home-section--muted">
    <div class="wrap home-section__inner">
      <div class="home-head">
        <div class="home-head__left">
          <span class="home-eyebrow">By price range</span>
          <h2 class="home-title">Browse by Budget</h2>
        </div>
      </div>
      <div class="home-budget-row budget-grid">${BUDGETS.slice(0, 5).map(budgetCard).join('')}</div>
    </div>
  </section>

  <!-- EV Spotlight -->
  ${evCars.length ? `
  <section class="home-section home-ev home-section--white">
    <div class="wrap">
      <div class="ev-hero">
        <div class="ev-hero-in">
          <div>
            <div class="ev-badge">Electric</div>
            <h2 class="ev-title">Built for Nepal's Roads</h2>
            <p class="ev-sub">${evCars.length} EV models with real range, V2L, and fast charging — hill-ready and load-shedding smart.</p>
            <div class="ev-stats">
              <div class="ev-stat"><div class="num">${evCars.length}</div><div class="lbl">Models</div></div>
              <div class="ev-stat"><div class="num">481km</div><div class="lbl">Max range</div></div>
            </div>
            <button type="button" onclick="AV.goTo('cars',{filter:'electric'})" class="btn btn-primary" style="margin-top:20px">Explore EVs →</button>
          </div>
          <div class="ev-cards">${evCars.slice(0, 4).map(c => `<div class="ev-mini" onclick="AV.openDetail('${c.slug}')"><img src="${c.images[0]}" class="ev-mini-img" alt="" loading="lazy"><div class="ev-mini-name">${c.brand} ${c.model}</div><div class="ev-mini-price">${window.Rs(c.variants[0].price)}</div></div>`).join('')}</div>
        </div>
      </div>
    </div>
  </section>` : ''}

  <!-- Events -->
  <section class="home-events events-section-modern">
    <div class="wrap">
      <div class="ev-header home-head">
        <div class="home-head__left">
          <span class="home-eyebrow">Auto culture</span>
          <h2 class="home-title ev-title">Upcoming Events</h2>
          <p class="home-sub ev-sub">Shows, test drives, and launches across Nepal.</p>
        </div>
        <button type="button" class="home-link ev-btn-outline">All events →</button>
      </div>
      <div class="ev-modern-grid">
        <div class="ev-modern-card featured">
          <div class="ev-card-bg" style="background-image:url('/assets/images/events/auto-expo.jpg');background-color:#1A1A1A"></div>
          <div class="ev-card-overlay"></div>
          <div class="ev-card-top"><span class="ev-badge live">Featured</span><span class="ev-badge free">Free</span></div>
          <div class="ev-card-content">
            <div class="ev-date-box"><div class="ev-day">18</div><div class="ev-month">APR</div></div>
            <div class="ev-info"><div class="ev-card-title">Nepal Auto Expo 2026</div><div class="ev-card-meta"><span>Bhrikutimandap, Kathmandu</span></div></div>
          </div>
        </div>
        <div class="ev-modern-card">
          <div class="ev-card-bg" style="background-image:url('/assets/images/events/test-drive.jpg');background-color:#2E4F8A"></div>
          <div class="ev-card-overlay"></div>
          <div class="ev-card-top"><span class="ev-badge">Test Drive</span></div>
          <div class="ev-card-content">
            <div class="ev-date-box"><div class="ev-day">22</div><div class="ev-month">APR</div></div>
            <div class="ev-info"><div class="ev-card-title">EV Test Drive Day</div><div class="ev-card-meta"><span>Naxal, Kathmandu</span></div></div>
          </div>
        </div>
        <div class="ev-modern-card">
          <div class="ev-card-bg" style="background-image:url('/assets/images/events/launch.jpg');background-color:#1C1C1C"></div>
          <div class="ev-card-overlay"></div>
          <div class="ev-card-top"><span class="ev-badge">Launch</span></div>
          <div class="ev-card-content">
            <div class="ev-date-box"><div class="ev-day">05</div><div class="ev-month">MAY</div></div>
            <div class="ev-info"><div class="ev-card-title">Exclusive SUV Reveal</div><div class="ev-card-meta"><span>Hotel Yak &amp; Yeti</span></div></div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Services -->
  <section class="home-section home-services home-section--muted">
    <div class="wrap home-section__inner">
      <div class="home-head">
        <div class="home-head__left">
          <span class="home-eyebrow">After you buy</span>
          <h2 class="home-title">Our Services</h2>
          <p class="home-sub">Paperwork, parts, maintenance, and financing — all in one place.</p>
        </div>
        <a href="services.html" class="home-link">All services</a>
      </div>
      <div class="svc-grid">
        ${svc('dotm-services.html', 'DOTM Services', 'Bluebook, renewal, and ownership transfer.', '<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>')}
        ${svc('maintenance-repairs.html', 'Maintenance', 'Servicing, diagnostics, and repairs.', '<path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/>')}
        ${svc('parts-accessories.html', 'Parts & Accessories', 'Genuine OEM and quality aftermarket.', '<path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>')}
        ${svc('insurance-finance.html', 'Insurance & Finance', 'Coverage and EMI from partner banks.', '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>')}
      </div>
    </div>
  </section>

  <!-- CTA -->
  <section class="home-section home-cta">
    <div class="wrap">
      <div class="cta-banner">
        <div class="cta-in">
          <div class="cta-label">Start your journey</div>
          <h2 class="cta-title">Find your perfect car in Nepal</h2>
          <p class="cta-sub">Compare models, calculate EMI, and explore every brand — all in one place.</p>
          <div class="cta-btns">
            <button type="button" onclick="AV.goTo('cars')" class="btn btn-primary" style="color:#fff">Browse all cars</button>
            <button type="button" onclick="window.location.href='book-service.html'" class="btn" style="background:rgba(255,255,255,.1);color:#fff;border:1px solid rgba(255,255,255,.2)">Book a service</button>
          </div>
        </div>
      </div>
    </div>
  </section>

</div>`;
};
