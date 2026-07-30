import getDiscoveredImages from "@/lib/getImageFiles";
import SplitExperienceClient from "./SplitExperienceClient";

export default function TreeHouseSection() {
  const images = getDiscoveredImages() || [];
  
  const bedImage = images.find((src) => src?.includes("bed")) || "/images/treehouse/bed.jpeg";
  const tableImage = images.find((src) => src?.includes("table")) || "/images/treehouse/table.jpeg";

  return <SplitExperienceClient bedImage={bedImage} tableImage={tableImage} />;
}