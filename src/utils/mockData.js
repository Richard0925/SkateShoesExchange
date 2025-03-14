// src/utils/mockData.js
// Mock data for development and testing purposes

// Mock users
const users = [
  {
    id: 'user_1',
    username: 'skateking',
    email: 'skateking@example.com',
    password: 'password123', // Would be hashed in a real application
    preferredFoot: 'left',
    shoeSize: 8,
    location: 'London',
    bio: 'Skateboarding enthusiast, passionate about street culture and skateboard shoe collection.',
    createdAt: '2023-01-15T08:30:00Z',
    listingsCount: 5,
    transactionsCount: 8,
    rating: 4.8
  },
  {
    id: 'user_2',
    username: 'boardgirl',
    email: 'boardgirl@example.com',
    password: 'securepass',
    preferredFoot: 'right',
    shoeSize: 5,
    location: 'Manchester',
    bio: 'Professional skater, participated in multiple competitions, looking for shoes suitable for right foot.',
    createdAt: '2023-02-22T14:15:00Z',
    listingsCount: 3,
    transactionsCount: 5,
    rating: 4.5
  },
  {
    id: 'user_3',
    username: 'olliepro',
    email: 'olliepro@example.com',
    password: 'ollie123',
    preferredFoot: 'left',
    shoeSize: 10,
    location: 'Birmingham',
    bio: 'Specialist in Ollie and Kickflip, looking for durable skateboarding shoes.',
    createdAt: '2023-03-10T10:45:00Z',
    listingsCount: 7,
    transactionsCount: 12,
    rating: 4.9
  },
  {
    id: 'user_4',
    username: 'flipmaster',
    email: 'flipmaster@example.com',
    password: 'flip4ever',
    preferredFoot: 'right',
    shoeSize: 7,
    location: 'Liverpool',
    bio: 'Street skateboarding enthusiast with lots of shoes to exchange.',
    createdAt: '2023-04-05T16:20:00Z',
    listingsCount: 10,
    transactionsCount: 15,
    rating: 4.7
  },
  {
    id: 'user_5',
    username: 'grindrails',
    email: 'grindrails@example.com',
    password: 'grinder555',
    preferredFoot: 'both',
    shoeSize: 9,
    location: 'Glasgow',
    bio: 'Specializes in rail slides, shoes wear out quickly and need frequent replacements.',
    createdAt: '2023-05-12T09:10:00Z',
    listingsCount: 4,
    transactionsCount: 9,
    rating: 4.6
  }
];

// Mock listings
const listings = [
  {
    id: 'listing_1',
    title: '90% New Nike SB Dunk Low Pro',
    brand: 'Nike SB',
    model: 'Dunk Low Pro',
    size: 8,
    condition: 9,
    preferredFoot: 'left',
    description: 'Left foot shoe, only worn a few times, in very good condition. Suitable for normal foot shape, provides good support and cushioning. Selling because the size isn\'t right, hoping to exchange for the same model for right foot.',
    imageUrls: ['/assets/images/placeholder.txt'],
    location: 'London',
    createdAt: '2023-11-15T08:30:00Z',
    author: {
      username: 'skateking',
      rating: 4.8
    }
  },
  {
    id: 'listing_2',
    title: 'Vans Old Skool Right Foot Only',
    brand: 'Vans',
    model: 'Old Skool',
    size: 5,
    condition: 8,
    preferredFoot: 'right',
    description: 'Classic Vans for right foot, worn for two months, slight wear but overall good condition. The sole and upper are still clean. Looking to exchange for left foot of the same or similar shoe.',
    imageUrls: ['/assets/images/placeholder.txt'],
    location: 'Manchester',
    createdAt: '2023-11-20T14:15:00Z',
    author: {
      username: 'boardgirl',
      rating: 4.5
    }
  },
  {
    id: 'listing_3',
    title: 'Adidas Busenitz Left Foot 70% New',
    brand: 'Adidas',
    model: 'Busenitz',
    size: 10,
    condition: 7,
    preferredFoot: 'left',
    description: 'Left foot Busenitz, great for street skating, some wear on the toe but sole and cushioning still in good condition. Looking to exchange for the same or similar right foot shoe.',
    imageUrls: ['/assets/images/placeholder.txt'],
    location: 'Birmingham',
    createdAt: '2023-11-25T10:45:00Z',
    author: {
      username: 'olliepro',
      rating: 4.9
    }
  },
  {
    id: 'listing_4',
    title: 'DC Shoes Legacy 98 Right Foot',
    brand: 'DC Shoes',
    model: 'Legacy 98',
    size: 7,
    condition: 8,
    preferredFoot: 'right',
    description: 'Right foot DC vintage model, rarely worn so well preserved, only slight wear. Insole and sole are almost new. Looking to exchange for any brand left foot skateboard shoe in the same size.',
    imageUrls: ['/assets/images/placeholder.txt'],
    location: 'Liverpool',
    createdAt: '2023-11-28T16:20:00Z',
    author: {
      username: 'flipmaster',
      rating: 4.7
    }
  },
  {
    id: 'listing_5',
    title: 'És Accel OG Right Foot Special Edition',
    brand: 'És',
    model: 'Accel OG',
    size: 9,
    condition: 9,
    preferredFoot: 'right',
    description: 'Limited edition És Accel OG right foot shoe, almost new, only worn once or twice. Perfect for technical tricks, provides excellent board feel. Looking to exchange because I prefer the feel of Vans.',
    imageUrls: ['/assets/images/placeholder.txt'],
    location: 'Glasgow',
    createdAt: '2023-12-01T09:10:00Z',
    author: {
      username: 'grindrails',
      rating: 4.6
    }
  },
  {
    id: 'listing_6',
    title: 'Converse CONS One Star Pro Left Foot',
    brand: 'Converse',
    model: 'CONS One Star Pro',
    size: 7.5,
    condition: 7,
    preferredFoot: 'left',
    description: 'Classic One Star Pro left foot, worn for some time, upper has some wear but functionally sound. Moderate sole wear, still plenty of life left. Looking to exchange for right foot in the same size.',
    imageUrls: ['/assets/images/placeholder.txt'],
    location: 'Edinburgh',
    createdAt: '2023-12-03T11:30:00Z',
    author: {
      username: 'skateking',
      rating: 4.8
    }
  },
  {
    id: 'listing_7',
    title: 'New Balance Numeric 440 Left Foot',
    brand: 'New Balance',
    model: 'Numeric 440',
    size: 6,
    condition: 8,
    preferredFoot: 'left',
    description: 'NB skate series left foot shoe, great quality with excellent support. Bought too small so barely worn, almost new condition. Looking to exchange for UK size 6 or 7 right foot shoe.',
    imageUrls: ['/assets/images/placeholder.txt'],
    location: 'Newcastle',
    createdAt: '2023-12-05T14:45:00Z',
    author: {
      username: 'boardgirl',
      rating: 4.5
    }
  },
  {
    id: 'listing_8',
    title: 'Brand New Lakai Cambridge Right Foot',
    brand: 'Lakai',
    model: 'Cambridge',
    size: 10,
    condition: 10,
    preferredFoot: 'right',
    description: 'Brand new right foot Lakai, bought but found the size doesn\'t fit, never worn. Comes with original packaging and spare laces. Looking to exchange for UK size 9 or 10 left foot skateboard shoe.',
    imageUrls: ['/assets/images/placeholder.txt'],
    location: 'Birmingham',
    createdAt: '2023-12-08T09:20:00Z',
    author: {
      username: 'olliepro',
      rating: 4.9
    }
  },
  {
    id: 'listing_9',
    title: 'Etnies Marana Left Foot',
    brand: 'Etnies',
    model: 'Marana',
    size: 7,
    condition: 6,
    preferredFoot: 'left',
    description: 'Durable Etnies left foot shoe, worn for some time, toe area has wear but sole and structure remain intact. This model is especially long-lasting and can still serve well. Looking for right foot exchange.',
    imageUrls: ['/assets/images/placeholder.txt'],
    location: 'Liverpool',
    createdAt: '2023-12-10T13:15:00Z',
    author: {
      username: 'flipmaster',
      rating: 4.7
    }
  },
  {
    id: 'listing_10',
    title: 'Emerica Reynolds G6 Right Foot 80% New',
    brand: 'Emerica',
    model: 'Reynolds G6',
    size: 9,
    condition: 8,
    preferredFoot: 'right',
    description: 'Emerica professional model right foot with G6 cushioning system, very comfortable. Used for about a month, in good condition. Looking to exchange because I need more board feel, want a shoe with thinner sole.',
    imageUrls: ['/assets/images/placeholder.txt'],
    location: 'Glasgow',
    createdAt: '2023-12-12T10:40:00Z',
    author: {
      username: 'grindrails',
      rating: 4.6
    }
  }
];

// Mock featured listings - typically would be curated by admins or algorithm
const featuredListings = [
  listings[0],  // Nike SB
  listings[4],  // És Accel
  listings[7],  // Lakai Cambridge
];

// Mock conversations
const conversations = [
  {
    id: 'conv_1',
    participants: ['skateking', 'boardgirl'],
    messages: [
      {
        id: 'msg_1',
        text: 'Hi, I\'m interested in your Vans Old Skool right foot shoe. Is it still available for exchange?',
        senderId: 'skateking',
        timestamp: '2023-12-10T14:30:00Z',
        isSender: false,
      },
      {
        id: 'msg_2',
        text: 'Hello! Yes, it\'s still available. Do you have any left foot shoes suitable for exchange?',
        senderId: 'boardgirl',
        timestamp: '2023-12-10T14:35:00Z',
        isSender: true,
      },
      {
        id: 'msg_3',
        text: 'I have a Nike SB left foot, 90% new, UK size 8. Would that fit you?',
        senderId: 'skateking',
        timestamp: '2023-12-10T14:40:00Z',
        isSender: false,
      }
    ],
    unread: true,
    createdAt: '2023-12-10T14:30:00Z',
    updatedAt: '2023-12-10T14:40:00Z',
    lastMessage: 'I have a Nike SB left foot, 90% new, UK size 8. Would that fit you?'
  },
  {
    id: 'conv_2',
    participants: ['skateking', 'olliepro'],
    messages: [
      {
        id: 'msg_1',
        text: 'Hello, I see you\'re looking for a left foot Adidas Busenitz, and I happen to have one.',
        senderId: 'olliepro',
        timestamp: '2023-12-08T09:15:00Z',
        isSender: true,
      },
      {
        id: 'msg_2',
        text: 'That\'s great! What size is it? I need a UK 8 or 9.',
        senderId: 'skateking',
        timestamp: '2023-12-08T09:20:00Z',
        isSender: false,
      },
      {
        id: 'msg_3',
        text: 'It\'s exactly UK size 8, in good condition. I can send you some photos if you\'d like.',
        senderId: 'olliepro',
        timestamp: '2023-12-08T09:25:00Z',
        isSender: true,
      },
      {
        id: 'msg_4',
        text: 'Yes please, send me the photos. If they look good, we can arrange a time and place to exchange.',
        senderId: 'skateking',
        timestamp: '2023-12-08T09:30:00Z',
        isSender: false,
      }
    ],
    unread: false,
    createdAt: '2023-12-08T09:15:00Z',
    updatedAt: '2023-12-08T09:30:00Z',
    lastMessage: 'Yes please, send me the photos. If they look good, we can arrange a time and place to exchange.'
  }
];

// Mock listing details (with comments)
const listingDetails = {
  ...listings[0],  // Using the first listing as base
  comments: [
    {
      id: 'comment_1',
      text: 'How is the cushioning on these shoes? Are they suitable for big jumps?',
      author: {
        username: 'flipmaster',
      },
      createdAt: '2023-11-16T10:15:00Z',
    },
    {
      id: 'comment_2',
      text: 'The cushioning is excellent. I\'ve used them for many high jumps without any issues.',
      author: {
        username: 'skateking',
      },
      createdAt: '2023-11-16T10:30:00Z',
    },
    {
      id: 'comment_3',
      text: 'Could you post a few more photos of the sole? I\'d like to see how worn they are.',
      author: {
        username: 'grindrails',
      },
      createdAt: '2023-11-17T14:45:00Z',
    }
  ]
};

// Export functions to get mock data
export const getUsers = () => {
  return [...users];
};

export const getUserData = (username) => {
  return users.find(user => user.username === username);
};

export const getDefaultListings = () => {
  return [...listings];
};

export const getFeaturedListings = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return [...featuredListings];
};

export const getMatchedListings = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 700));
  // In a real app, this would filter based on the current user's preferred foot
  // For now, just return a subset of listings that would match a right-foot user
  return listings.filter(listing => listing.preferredFoot === 'left').slice(0, 3);
};

export const getListingDetails = (id) => {
  if (id === 'listing_1') {
    return {...listingDetails};
  }
  return listings.find(listing => listing.id === id);
};

export const getUserListings = (username) => {
  return listings.filter(listing => listing.author.username === username);
};

export const getConversations = (username) => {
  // Format conversations for display
  return conversations.map(conv => {
    // Find the other participant (not the current user)
    const otherParticipant = conv.participants.find(p => p !== username);
    
    return {
      id: conv.id,
      recipient: {
        username: otherParticipant,
        isOnline: Math.random() > 0.5, // Random online status for demo
      },
      messages: conv.messages.map(msg => ({
        ...msg,
        isSender: msg.senderId === username,
      })),
      unread: conv.unread,
      createdAt: conv.createdAt,
      updatedAt: conv.updatedAt,
      lastMessage: conv.lastMessage,
    };
  });
};

export const getMessages = (conversationId) => {
  const conversation = conversations.find(c => c.id === conversationId);
  if (!conversation) return [];
  
  return conversation.messages;
};

export default {
  getUsers,
  getUserData,
  getDefaultListings,
  getFeaturedListings,
  getMatchedListings,
  getListingDetails,
  getUserListings,
  getConversations,
  getMessages,
};