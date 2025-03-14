# Project Summary

The SkateSwap project is a peer-to-peer (C2C) marketplace platform specifically designed for skateboard enthusiasts to buy, sell, and exchange used skateboard shoes. It aims to extend the life cycle of skateboarding footwear by connecting users who are looking to exchange shoes that fit their preferences (e.g., left/right foot). The platform provides a seamless experience for users to manage their profiles, list their shoes, and interact with the community, while also ensuring a fun and engaging environment for sharing stories and experiences related to skateboarding.

# Project Module Description

## Functional Modules

1. **User Authentication**: Allows users to register, log in, manage their profiles, and maintain preferences, including preferred foot and shoe size.

2. **Shoe Listings**: Users can create, update, or delete listings for shoes they wish to exchange, with options for detailed descriptions, images, and conditions.

3. **Transaction Management**: Facilitates the entire exchange workflow, where users can initiate, accept, reject, or complete transactions.

4. **Search and Filtering**: Implements search functionalities to find footwear based on brand, size, condition, and location preferences.

5. **Messaging System**: Enables direct communication between users to discuss exchanges or ask questions regarding listings.

6. **Donation Functionality**: Users can make donations via the "Get Developer a Beer" feature to support the platform and its developers.

7. **Community Interaction**: Optional feature that allows users to share stories and engage with the skateboarding community.

# Directory Tree

```
/data/chats/0l48m/workspace
+-- react_template
|   +-- README.md
|   +-- eslint.config.js
|   +-- index.html
|   +-- package.json
|   +-- postcss.config.js
|   +-- public
|   |   +-- assets
|   |   |   +-- images
|   |   |       +-- logo.txt
|   |   |       +-- placeholder.txt
|   |   +-- data
|   |       +-- example.json
|   +-- src
|   |   +-- App.jsx
|   |   +-- components
|   |   |   +-- auth
|   |   |   |   +-- AuthModal.jsx
|   |   |   |   +-- LoginForm.jsx
|   |   |   |   +-- RegisterForm.jsx
|   |   |   +-- donations
|   |   |   |   +-- DonateButton.jsx
|   |   |   |   +-- DonationModal.jsx
|   |   |   |   +-- Leaderboard.jsx
|   |   |   +-- layout
|   |   |   |   +-- Footer.jsx
|   |   |   |   +-- Header.jsx
|   |   |   +-- listings
|   |   |   |   +-- ListingCard.jsx
|   |   |   |   +-- ListingDetail.jsx
|   |   |   |   +-- ListingForm.jsx
|   |   |   +-- messaging
|   |   |   |   +-- MessageForm.jsx
|   |   |   |   +-- MessageThread.jsx
|   |   |   +-- profile
|   |   |   |   +-- UserListings.jsx
|   |   |   |   +-- UserProfile.jsx
|   |   |   +-- search
|   |   |   |   +-- FilterBar.jsx
|   |   |   |   +-- SearchBar.jsx
|   |   |   +-- transactions
|   |   |       +-- TransactionItem.jsx
|   |   +-- contexts
|   |   |   +-- AuthContext.jsx
|   |   |   +-- ListingsContext.jsx
|   |   |   +-- MessagesContext.jsx
|   |   +-- index.css
|   |   +-- main.jsx
|   |   +-- pages
|   |   |   +-- CreateListingPage.jsx
|   |   |   +-- HomePage.jsx
|   |   |   +-- LeaderboardPage.jsx
|   |   |   +-- ListingDetailPage.jsx
|   |   |   +-- MessagesPage.jsx
|   |   |   +-- ProfilePage.jsx
|   |   +-- utils
|   |       +-- api.js
|   |       +-- mockData.js
|   +-- tailwind.config.js
|   +-- template_config.json
|   +-- vite.config.js
+-- skateboard_exchange_class_diagram.mermaid
+-- skateboard_exchange_sequence_diagram.mermaid
+-- skateboard_exchange_system_design.md
+-- skateboard_shoe_exchange_platform_prd.md
```

# File Description Inventory

- **skateboard_shoe_exchange_platform_prd.md**: Comprehensive PRD document outlining product definition, technical specifications, UI designs, user flows, implementation plan, and risk assessment.
- **skateboard_exchange_system_design.md**: Detailed technical architecture document describing the implementation approach, key technical decisions, API endpoints, and data structures.
- **skateboard_exchange_class_diagram.mermaid**: Class diagram showing entities and their relationships within the platform.
- **skateboard_exchange_sequence_diagram.mermaid**: Sequence diagram illustrating the flow of operations in the platform.
- **react_template**: Directory containing the React application structure including components, assets, and configurations.

# Technology Stack

- **Frontend**: React, Vite, Tailwind CSS
- **Backend**: Sharetribe Marketplace API (Node.js)
- **Database**: PostgreSQL
- **Payment Processing**: Stripe Donations API

# Usage

## Installation

- Run `pnpm install` to install dependencies as specified in the `package.json` file.

## Running the App

- Use the command `pnpm run dev` to start the development server.

## Building the App

- To build the application for production, execute `pnpm run build`.

This process will compile the application and prepare it for deployment.

``` 

This WIKI integrates and streamlines information regarding the SkateSwap project, providing a concise overview of its functionality and structure while maintaining clarity and focus on the project's purpose.

# INSTRUCTION
- Project Path:`/data/chats/0l48m/workspace/react_template`
- You can search for the file path in the 'Directory Tree';
- After modifying the project files, if this project can be previewed, then you need to reinstall dependencies, restart service and preview;
