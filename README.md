# SlimTaxi

A modern ride-hailing application built with React and Firebase, offering a streamlined experience for both riders and drivers.

## Features

- User authentication and authorization
- Real-time location tracking
- Interactive map interface
- Ride booking and management
- Driver-passenger matching
- Payment integration
- Rating system

## Tech Stack

- Frontend: React.js
- Backend: Firebase
- Database: Supabase
- Maps: Google Maps API
- State Management: Redux
- Styling: Material-UI
- Internationalization: i18next

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Google Maps API key
- Firebase account
- Supabase account

## Installation

1. Clone the repository:
```bash
git clone [your-repository-url]
cd slimTaxi
```

2. Install dependencies:
```bash
cd Sourcecode/web-app
npm install
```

3. Set up environment variables:
Create a `.env` file in the web-app directory and add your configuration:
```
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server:
```bash
npm start
```

## Project Structure

```
slimTaxi/
├── Sourcecode/
│   ├── common/           # Shared utilities and components
│   ├── web-app/         # React frontend application
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── views/
│   │   │   ├── services/
│   │   │   ├── config/
│   │   │   └── utils/
│   │   └── public/
│   └── database/        # Database schemas and migrations
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Google Maps Platform
- Firebase team
- Supabase team
- Material-UI team
- All contributors who helped with the project 