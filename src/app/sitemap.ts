import { MetadataRoute } from 'next';
import { getAdminDb } from '@/lib/firebase/admin';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const adminDb = await getAdminDb();
  const baseUrl = 'https://aabporg.uk';
  const locales = ['en', 'az', 'ru'];

  // Base route paths
  const routePaths = [
    '',
    '/about',
    '/about/mission',
    '/about/history',
    '/about/leadership',
    '/events',
    '/research',
    '/research/projects',
    '/research/publications',
    '/career',
    '/media',
    '/forum',
    '/resources',
    '/network',
    '/contact',
    '/privacy',
    '/terms',
    '/login',
    '/register',
  ];

  // Build localized base routes correctly (no double-prefixing)
  const routes: MetadataRoute.Sitemap = locales.flatMap(locale =>
    routePaths.map(path => ({
      url: `${baseUrl}/${locale}${path}`,
      lastModified: new Date().toISOString(),
      changeFrequency: (path === '' ? 'daily' : 'weekly') as 'daily' | 'weekly',
      priority: path === '' ? 1 : path.startsWith('/about/') ? 0.7 : 0.8,
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
    console.error('Error generating dynamic sitemap for events:', error);
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
    console.error('Error generating dynamic sitemap for articles:', error);
  }

  // Add dynamic research pages
  try {
    if (adminDb) {
      const researchSnapshot = await adminDb.collection('research').get();
      const researchRoutes = researchSnapshot.docs.flatMap(doc =>
        locales.map(locale => ({
          url: `${baseUrl}/${locale}/research/${doc.id}`,
          lastModified: new Date().toISOString(),
          changeFrequency: 'monthly' as const,
          priority: 0.6,
        }))
      );
      routes.push(...researchRoutes);
    }
  } catch (error) {
    console.error('Error generating dynamic sitemap for research:', error);
  }

  return routes;
}
