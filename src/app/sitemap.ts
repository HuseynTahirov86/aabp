import { MetadataRoute } from 'next';
import { adminDb } from '@/lib/firebase/admin';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://aabporg.uk';
  const locales = ['en', 'az', 'ru'];

  // Base route paths
  const routePaths = ['', '/about', '/events', '/research', '/career', '/media', '/contact', '/login', '/register'];

  // Build localized base routes correctly (no double-prefixing)
  const routes: MetadataRoute.Sitemap = locales.flatMap(locale =>
    routePaths.map(path => ({
      url: `${baseUrl}/${locale}${path}`,
      lastModified: new Date().toISOString(),
      changeFrequency: (path === '' ? 'daily' : 'weekly') as 'daily' | 'weekly',
      priority: path === '' ? 1 : 0.8,
    }))
  );

  // Add dynamic event pages
  try {
    if (adminDb) {
      const eventsSnapshot = await adminDb.collection('events').where('status', '==', 'Published').get();
      const eventRoutes = eventsSnapshot.docs.flatMap(doc =>
        locales.map(locale => ({
          url: `${baseUrl}/${locale}/events/${doc.id}`,
          lastModified: new Date().toISOString(),
          changeFrequency: 'monthly' as const,
          priority: 0.7,
        }))
      );
      routes.push(...eventRoutes);
    }
  } catch (error) {
    console.log('Error generating dynamic sitemap for events:', error);
  }

  // Add dynamic article/media pages
  try {
    if (adminDb) {
      const articlesSnapshot = await adminDb
        .collection('articles')
        .where('status', '==', 'Published')
        .get();
      const articleRoutes = articlesSnapshot.docs.flatMap(doc =>
        locales.map(locale => ({
          url: `${baseUrl}/${locale}/media/${doc.id}`,
          lastModified: new Date().toISOString(),
          changeFrequency: 'monthly' as const,
          priority: 0.7,
        }))
      );
      routes.push(...articleRoutes);
    }
  } catch (error) {
    console.log('Error generating dynamic sitemap for articles:', error);
  }

  return routes;
}
