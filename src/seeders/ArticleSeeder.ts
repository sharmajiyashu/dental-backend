import Article from '../models/Article';
import AppLogger from '../api/loaders/logger';

const defaultArticles = [
  {
    title: "How to Brush Properly",
    category: "Oral Health",
    readTime: "5 min read",
    description: "Learn correct brushing techniques for healthy teeth and gums to prevent cavities and maintain fresh breath.",
    videoUrl: "https://www.youtube.com/embed/5T8k91mOq7A",
    imageUrl: "https://images.unsplash.com/photo-1559599101-f09722fb4948?w=800&auto=format&fit=crop",
    steps: [
      "Use a soft-bristled toothbrush and fluoride toothpaste.",
      "Place your toothbrush at a 45-degree angle to the gums.",
      "Gently move the brush back and forth in short (tooth-wide) strokes.",
      "Brush the outer surfaces, the inner surfaces, and the chewing surfaces of the teeth.",
      "Brush your tongue to remove bacteria and keep breath fresh.",
      "Brush for at least 2 minutes, twice a day."
    ]
  },
  {
    title: "Benefits of Flossing",
    category: "Oral Health",
    readTime: "4 min read",
    description: "Flossing cleans between your teeth where a toothbrush can't reach. Discover why it's critical for gum health.",
    videoUrl: "https://www.youtube.com/embed/HhQnrykaztw",
    imageUrl: "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=800&auto=format&fit=crop",
    steps: [
      "Use about 18 inches of floss wound around your middle fingers.",
      "Hold the floss tightly between your thumbs and forefingers.",
      "Guide the floss gently between your teeth using a gentle rubbing motion.",
      "Curve the floss into a C-shape against the side of each tooth.",
      "Slide the floss gently up and down against the tooth surface and under the gumline.",
      "Floss once a day, preferably before bedtime."
    ]
  },
  {
    title: "Choosing the Right Toothpaste",
    category: "Oral Health",
    readTime: "3 min read",
    description: "Fluoride, whitening, sensitive? Here's how to navigate the toothpaste aisle and pick the best option for you.",
    imageUrl: "https://images.unsplash.com/photo-1549476464-37392f719c28?w=800&auto=format&fit=crop",
    steps: [
      "Always look for fluoride to protect against cavities.",
      "Choose sensitive toothpaste if cold or hot food causes discomfort.",
      "Avoid highly abrasive whitening toothpastes if you have thin enamel.",
      "Check for ADA (American Dental Association) approval seal."
    ]
  },
  {
    title: "Balanced Diet for a Healthy Life",
    category: "Nutrition",
    readTime: "5 min read",
    description: "How eating leafy greens, reducing sugar, and staying hydrated directly translates to better teeth and daily health.",
    imageUrl: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&auto=format&fit=crop",
    steps: [
      "Incorporate crisp fruits and vegetables that clean teeth as you chew.",
      "Reduce processed sugars which feed decay-causing bacteria.",
      "Drink plenty of water to rinse away food particles and build saliva.",
      "Include calcium-rich foods like dairy or fortified almond milk to strengthen enamel."
    ]
  }
];

export async function seedArticles() {
  try {
    const count = await Article.countDocuments();
    if (count === 0) {
      await Article.insertMany(defaultArticles);
      AppLogger.info('🌱 Successfully seeded default learning articles in MongoDB.');
    }
  } catch (error) {
    AppLogger.error('❌ Error seeding articles:', error);
  }
}
