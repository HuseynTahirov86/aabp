import { notFound } from "next/navigation";

// Catches any URL under a valid locale that doesn't match a real page
// (e.g. /az/does-not-exist) and routes it into this segment's own
// not-found.tsx instead of falling through to the framework's generic
// default 404, which has no styling, translations, or navigation.
export default function CatchAllPage(): never {
  notFound();
}
