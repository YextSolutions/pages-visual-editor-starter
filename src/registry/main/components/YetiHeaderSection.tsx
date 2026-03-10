import { Box, Flex, Text } from "@chakra-ui/react";
import { ComponentConfig, Fields, PuckComponent } from "@puckeditor/core";
import { useState } from "react";
import { Link } from "@yext/pages-components";

type UtilityLink = {
  label: string;
  href: string;
  kind: "modal" | "link";
};

type LocaleOption = {
  label: string;
  href: string;
};

type NavigationChild = {
  label: string;
  href: string;
};

type NavigationGroup = {
  label: string;
  href: string;
  children: NavigationChild[];
};

type NavigationPromo = {
  title: string;
  copy: string;
  label: string;
  href: string;
  imageUrl: string;
} | null;

type NavigationItem = {
  label: string;
  href: string;
  groups: NavigationGroup[];
  promo: NavigationPromo;
};

export type YetiHeaderSectionProps = {
  utilityLinks: UtilityLink[];
  localeLabel: string;
  localeOptions: LocaleOption[];
  primaryNavigation: NavigationItem[];
};

const defaultUtilityLinks: UtilityLink[] = [
  {
    label: "YETI Rescues Resale",
    href: "javascript:void(0)",
    kind: "modal",
  },
  {
    label: "Find a Store",
    href: "https://www.yeti.com/find-a-store",
    kind: "link",
  },
  {
    label: "Customer Support",
    href: "javascript:void(0)",
    kind: "modal",
  },
  {
    label: "Corporate Sales",
    href: "https://www.yeti.com/corporate-sales.html",
    kind: "link",
  },
];

const defaultLocaleOptions: LocaleOption[] = [
  { label: "USA / ES", href: "https://www.yeti.com/es" },
  { label: "AU / EN", href: "https://au.yeti.com/" },
  { label: "CA / EN", href: "https://www.yeti.ca" },
  { label: "CA / FR", href: "https://www.yeti.ca/fr" },
  { label: "EU / EN", href: "https://eu.yeti.com/" },
  { label: "FR / FR", href: "https://fr.yeti.com/" },
  { label: "IT / IT", href: "https://it.yeti.com/" },
  { label: "DE / DE", href: "https://de.yeti.com/" },
  { label: "IE / EN", href: "https://ie.yeti.com/" },
  { label: "NL / NL", href: "https://nl.yeti.com/" },
  { label: "NZ / EN", href: "https://nz.yeti.com/" },
  { label: "GB / EN", href: "https://uk.yeti.com/" },
];

const defaultPrimaryNavigation: NavigationItem[] = [
  {
    label: "+ Customize",
    href: "https://www.yeti.com/customize",
    groups: [],
    promo: null,
  },
  {
    label: "Drinkware",
    href: "",
    groups: [
      {
        label: "Shop All",
        href: "https://www.yeti.com/drinkware",
        children: [],
      },
      {
        label: "Featured",
        href: "",
        children: [
          {
            label: "Customize Your Drinkware",
            href: "https://www.yeti.com/customize/by-product/drinkware#product-search-results",
          },
          {
            label: "New Arrivals",
            href: "https://www.yeti.com/collections/new-arrivals?prefn1=productRefinementCategory&prefv1=Drinkware",
          },
          {
            label: "Ceramic Collection",
            href: "https://www.yeti.com/collections/featured/durasip-ceramic-collection",
          },
          {
            label: "Fandom Collection",
            href: "https://www.yeti.com/drinkware/fandom-collection-chug-bottle-26oz.html",
          },
          {
            label: "Hosting & Entertaining",
            href: "https://www.yeti.com/collections/featured/hosting-and-entertaining",
          },
          {
            label: "Commuter Drinkware",
            href: "https://www.yeti.com/collections/featured/commuter-essentials?prefn1=productRefinementCategory&prefv1=Drinkware",
          },
          {
            label: "Leakproof Drinkware",
            href: "https://www.yeti.com/drinkware-and-cookware/hydration/leakproof-water-bottles",
          },
        ],
      },
      {
        label: "Hydration",
        href: "https://www.yeti.com/drinkware/hydration",
        children: [
          {
            label: "Shop All",
            href: "https://www.yeti.com/drinkware/hydration",
          },
          {
            label: "Leakproof Drinkware",
            href: "https://www.yeti.com/drinkware/hydration/leakproof-drinkware",
          },
          {
            label: "Sports Hydration",
            href: "https://www.yeti.com/drinkware/sports-hydration",
          },
          {
            label: "Straw Drinkware",
            href: "https://www.yeti.com/drinkware/straw-drinkware",
          },
          {
            label: "Insulated Water Bottles",
            href: "https://www.yeti.com/drinkware/hydration?prefn1=productType&prefv1=Bottles&prefn2=features&prefv2=Insulated",
          },
          {
            label: "Kids Drinkware",
            href: "https://www.yeti.com/collections/featured/kids-collection?prefn1=productRefinementCategory&prefv1=Drinkware",
          },
          {
            label: "Plastic Drinkware",
            href: "https://www.yeti.com/drinkware/hydration?prefn1=collection&prefv1=Silo|Yonder",
          },
          {
            label: "Jugs",
            href: "https://www.yeti.com/drinkware?prefn1=productType&prefv1=Jugs",
          },
        ],
      },
      {
        label: "Coffee & Tea",
        href: "https://www.yeti.com/drinkware/mugs",
        children: [
          { label: "Shop All", href: "https://www.yeti.com/drinkware/mugs" },
          {
            label: "Ceramic Coffee",
            href: "https://www.yeti.com/collections/featured/durasip-ceramic-collection?cgid=durasip-ceramic-collection&prefn1=productType&prefv1=Espresso%20Sets%7cFrench%20Press%7cMugs&srule=best-matches",
          },
          {
            label: "Stackable Cups",
            href: "https://www.yeti.com/drinkware/mugs?prefn1=features&prefv1=Stackable",
          },
          {
            label: "Tumblers",
            href: "https://www.yeti.com/drinkware/tumblers",
          },
          {
            label: "Mugs",
            href: "https://www.yeti.com/drinkware/mugs?prefn1=productType&prefv1=Mugs",
          },
          {
            label: "Travel Bottles",
            href: "https://www.yeti.com/drinkware/mugs/travel-bottle.html",
          },
          {
            label: "French Press",
            href: "https://www.yeti.com/drinkware/mugs/french-press-34oz.html",
          },
          {
            label: "Espresso Sets",
            href: "https://www.yeti.com/drinkware/mugs/espresso-cup-6oz-2pk.html",
          },
          {
            label: "Pour Over",
            href: "https://www.yeti.com/drinkware/mugs/pour-over.html",
          },
        ],
      },
      {
        label: "Barware",
        href: "https://www.yeti.com/drinkware/barware",
        children: [
          {
            label: "Shop All",
            href: "https://www.yeti.com/drinkware/barware",
          },
          {
            label: "Ceramic Barware",
            href: "https://www.yeti.com/collections/featured/durasip-ceramic-collection?cgid=durasip-ceramic-collection&prefn1=productType&prefv1=Pitcher%7cTumblers&srule=best-matches",
          },
          {
            label: "Colster Can Coolers",
            href: "https://www.yeti.com/drinkware/can-insulators/colster-12oz.html",
          },
          {
            label: "Lowball",
            href: "https://www.yeti.com/drinkware/barware/ceramic-lowball-10oz.html",
          },
          {
            label: "Wine Tumbler",
            href: "https://www.yeti.com/drinkware/barware/ceramic-wine-tumbler-10oz.html",
          },
          {
            label: "Flask",
            href: "https://www.yeti.com/drinkware/barware/yeti-flask.html",
          },
          {
            label: "Shot Glasses",
            href: "https://www.yeti.com/drinkware/barware/yeti-shot-glasses.html",
          },
          {
            label: "Beverage Bucket",
            href: "https://www.yeti.com/drinkware/barware/beverage-bucket.html",
          },
          {
            label: "Cocktail Shaker",
            href: "https://www.yeti.com/drinkware/barware/cocktail-shaker.html",
          },
          {
            label: "Wine Chiller",
            href: "https://www.yeti.com/drinkware/barware/wine-chiller.html",
          },
          {
            label: "Pitcher",
            href: "https://www.yeti.com/drinkware/barware/pitcher.html",
          },
        ],
      },
      {
        label: "Accessories",
        href: "https://www.yeti.com/drinkware/accessories",
        children: [
          {
            label: "Shop All",
            href: "https://www.yeti.com/drinkware/accessories",
          },
          {
            label: "MagSlider Packs",
            href: "https://www.yeti.com/drinkware/drinkware-accessories/magslider-color-pack.html",
          },
          {
            label: "MagSlider Lids",
            href: "https://www.yeti.com/drinkware/drinkware-accessories/rambler-magslider-lid.html",
          },
          {
            label: "Rambler Bottle Straw Cap",
            href: "https://www.yeti.com/accessories/rambler-bottle-straw-cap/21070160011.html",
          },
          {
            label: "Rambler Bottle Chug Cap",
            href: "https://www.yeti.com/drinkware/drinkware-accessories/21070100005.html",
          },
          {
            label: "Rambler Bottle MagDock Cap",
            href: "https://www.yeti.com/drinkware/drinkware-accessories/21071300216.html",
          },
          {
            label: "Rambler Straw Lids",
            href: "https://www.yeti.com/drinkware/drinkware-accessories/rambler-straw-lid.html",
          },
          {
            label: "Cocktail Shaker Lid",
            href: "https://www.yeti.com/drinkware/barware/21071501989.html",
          },
        ],
      },
    ],
    promo: null,
  },
  {
    label: "Coolers",
    href: "",
    groups: [
      {
        label: "Shop All",
        href: "https://www.yeti.com/coolers",
        children: [],
      },
      {
        label: "Hard Coolers",
        href: "https://www.yeti.com/coolers/hard-coolers",
        children: [
          {
            label: "Shop All",
            href: "https://www.yeti.com/coolers/hard-coolers",
          },
          {
            label: "Tundra",
            href: "https://www.yeti.com/coolers/hard-coolers?prefn1=collection&prefv1=Tundra",
          },
          {
            label: "Roadie",
            href: "https://www.yeti.com/coolers/hard-coolers?prefn1=collection&prefv1=Roadie",
          },
          {
            label: "V Series",
            href: "https://www.yeti.com/coolers/hard-coolers/v-series/vseries.html",
          },
          {
            label: "Tank",
            href: "https://www.yeti.com/coolers/hard-coolers?prefn1=collection&prefv1=Tank",
          },
          {
            label: "Silo",
            href: "https://www.yeti.com/coolers/hard-coolers/silo/silo.html",
          },
          {
            label: "Licensed Coolers",
            href: "https://www.yeti.com/customize/by-product/hard-coolers",
          },
        ],
      },
      {
        label: "Soft Coolers",
        href: "https://www.yeti.com/coolers/soft-coolers",
        children: [
          {
            label: "Shop All",
            href: "https://www.yeti.com/coolers/soft-coolers",
          },
          {
            label: "Hopper Backpacks",
            href: "https://www.yeti.com/coolers/soft-coolers?prefn1=productType&prefv1=Backpack%20Coolers",
          },
          {
            label: "Hopper Totes",
            href: "https://www.yeti.com/coolers/soft-coolers?prefn1=productType&prefv1=Tote%20Coolers",
          },
          {
            label: "Hopper Flip",
            href: "https://www.yeti.com/coolers/soft-coolers?prefn1=productType&prefv1=Cube%20Coolers",
          },
          {
            label: "Daytrip Soft Coolers",
            href: "https://www.yeti.com/coolers/soft-coolers?prefn1=collection&prefv1=Daytrip",
          },
        ],
      },
      {
        label: "Accessories",
        href: "https://www.yeti.com/coolers/accessories",
        children: [
          {
            label: "Shop All",
            href: "https://www.yeti.com/coolers/accessories",
          },
          {
            label: "Tundra",
            href: "https://www.yeti.com/coolers/accessories?tab=coolerAccessoriesTundra",
          },
          {
            label: "Roadie",
            href: "https://www.yeti.com/coolers/accessories?tab=coolerAccessoriesRoadie",
          },
          {
            label: "Hopper",
            href: "https://www.yeti.com/coolers/accessories?tab=coolerAccessoriesHopper",
          },
          {
            label: "Tank",
            href: "https://www.yeti.com/coolers/accessories?tab=coolerAccessoriesTank",
          },
          {
            label: "Daytrip",
            href: "https://www.yeti.com/coolers/accessories?tab=coolerAccessoriesDaytrip",
          },
        ],
      },
    ],
    promo: {
      title: "Coolers Buying Guide",
      copy: "",
      label: "explore",
      href: "https://www.yeti.com/buying-guides/cooler-buyers-guide.html",
      imageUrl:
        "background-image: url(https://yeti-webmedia.imgix.net/m/5bb339f904aefb69/original/250083_Nav_BSQ_Global_Spot_Large_Lifestyle_Holiday_2025_Roadie15_Desktop-2x.jpg?auto=format,compress&w=450&h=450)",
    },
  },
  {
    label: "Bags",
    href: "",
    groups: [
      {
        label: "Shop All",
        href: "https://www.yeti.com/bags",
        children: [],
      },
      {
        label: "Everyday Bags",
        href: "https://www.yeti.com/bags/everyday-bags",
        children: [
          {
            label: "Shop All",
            href: "https://www.yeti.com/bags/everyday-bags",
          },
          {
            label: "Tote Bags",
            href: "https://www.yeti.com/bags/everyday-bags?prefn1=productType&prefv1=Tote%20Bags",
          },
          {
            label: "Backpacks",
            href: "https://www.yeti.com/bags/everyday-bags?prefn1=productType&prefv1=Backpacks",
          },
          {
            label: "Lunch Coolers",
            href: "https://www.yeti.com/bags/everyday-bags?prefn1=productType&prefv1=Lunch%20Coolers",
          },
          {
            label: "Dry Gear Case",
            href: "https://www.yeti.com/bags/everyday-bags?prefn1=productType&prefv1=Gear%20Case",
          },
        ],
      },
      {
        label: "Travel Bags",
        href: "https://www.yeti.com/bags/travel-bags",
        children: [
          {
            label: "Shop All",
            href: "https://www.yeti.com/bags/travel-bags",
          },
          {
            label: "Luggage",
            href: "https://www.yeti.com/bags/travel-bags?prefn1=productType&prefv1=Luggage",
          },
          {
            label: "Duffels",
            href: "https://www.yeti.com/bags/travel-bags?prefn1=productType&prefv1=Duffels",
          },
          {
            label: "Backpacks",
            href: "https://www.yeti.com/bags/travel-bags?prefn1=productType&prefv1=Backpacks",
          },
          {
            label: "Packing Cubes",
            href: "https://www.yeti.com/bags/travel-bags?prefn1=productType&prefv1=Packing%20Cubes",
          },
        ],
      },
      {
        label: "Outdoor Bags",
        href: "https://www.yeti.com/bags/outdoor-bags",
        children: [
          {
            label: "Shop All",
            href: "https://www.yeti.com/bags/outdoor-bags",
          },
          {
            label: "Hiking Packs",
            href: "https://www.yeti.com/bags/outdoor-bags?prefn1=collection&prefv1=Skala",
          },
          {
            label: "Dry Bags",
            href: "https://www.yeti.com/bags/outdoor-bags?prefn1=collection&prefv1=Panga",
          },
          {
            label: "Dry Gear Case",
            href: "https://www.yeti.com/bags/outdoor-bags?prefn1=collection&prefv1=Sidekick%20Dry",
          },
        ],
      },
      {
        label: "Accessories",
        href: "https://www.yeti.com/bags/accessories",
        children: [
          {
            label: "Shop All",
            href: "https://www.yeti.com/bags/accessories",
          },
          {
            label: "Patches",
            href: "https://www.yeti.com/bags/accessories?prefn1=productType&prefv1=Patches",
          },
          {
            label: "Dry Gear Case",
            href: "https://www.yeti.com/bags/bags-accessories/sidekick-dry.html",
          },
          {
            label: "Dry Gear Case Straps",
            href: "https://www.yeti.com/bags/bags-accessories/sideclick-strap.html",
          },
          {
            label: "Bottle Openers",
            href: "https://www.yeti.com/bags/accessories?prefn1=productType&prefv1=Bottle%20Openers",
          },
          {
            label: "Packing Cubes",
            href: "https://www.yeti.com/bags/packing-cubes/crossroads-packing-cube.html",
          },
          {
            label: "Bottle Slings",
            href: "https://www.yeti.com/drinkware/drinkware-accessories/bottle-sling.html",
          },
        ],
      },
    ],
    promo: {
      title: "bags buying guide",
      copy: "",
      label: "explore",
      href: "https://www.yeti.com/buying-guides/bags-buyers-guide.html",
      imageUrl:
        "background-image: url(https://yeti-webmedia.imgix.net/m/4efdc6ad36c15479/original/250158_HP_BSQ_10-0_50_50_Lifestyle_Camino_Restock_CapeTaupe_Mobile-2x.jpg?auto=format,compress&w=450&h=450)",
    },
  },
  {
    label: "Kitchen",
    href: "",
    groups: [
      {
        label: "Shop All",
        href: "https://www.yeti.com/kitchen",
        children: [],
      },
      {
        label: "Featured",
        href: "",
        children: [
          {
            label: "Hosting & Entertaining",
            href: "https://www.yeti.com/collections/featured/hosting-and-entertaining",
          },
          {
            label: "New Arrivals",
            href: "https://www.yeti.com/collections/new-arrivals?prefn1=productRefinementCategory&prefv1=Kitchen",
          },
          {
            label: "Recipes",
            href: "https://www.yeti.com/stories/all-stories.html?crefn2=page.storePage.pursuit&crefv2=Food%20%26%20Beverage",
          },
        ],
      },
      {
        label: "Cookware",
        href: "https://www.yeti.com/kitchen/cookware",
        children: [
          { label: "Shop All", href: "https://www.yeti.com/kitchen/cookware" },
          {
            label: "Carbon Steel Pan",
            href: "https://www.yeti.com/kitchen/cookware/carbon-steel-pan.html",
          },
          {
            label: "Cast Iron Ranch Pan",
            href: "https://www.yeti.com/kitchen/cookware/ranch-pan-deep-skillet-6qt.html",
          },
          {
            label: "Cast Iron Skillets",
            href: "https://www.yeti.com/kitchen/cookware/cast-iron-skillet.html",
          },
          {
            label: "Stainless Steel Lid",
            href: "https://www.yeti.com/kitchen/cookware/stainless-steel-lid-12.html",
          },
        ],
      },
      {
        label: "Food Containers",
        href: "https://www.yeti.com/kitchen/food-containers",
        children: [
          {
            label: "Shop All",
            href: "https://www.yeti.com/kitchen/food-containers",
          },
          {
            label: "Food Jars",
            href: "https://www.yeti.com/kitchen/food-containers/food-jar.html",
          },
          {
            label: "Food Storage",
            href: "https://www.yeti.com/kitchen/food-containers/food-storage.html",
          },
          {
            label: "Food Storage Set",
            href: "https://www.yeti.com/kitchen/food-containers?prefn1=productType&prefv1=Sets",
          },
        ],
      },
      {
        label: "Insulated Bowls",
        href: "https://www.yeti.com/kitchen/insulated-bowls",
        children: [
          {
            label: "Shop All",
            href: "https://www.yeti.com/kitchen/insulated-bowls",
          },
          {
            label: "Low Bowls",
            href: "https://www.yeti.com/kitchen/food-bowls/food-bowl-low.html",
          },
          {
            label: "Standard Bowls",
            href: "https://www.yeti.com/kitchen/food-bowls/food-bowl-standard.html",
          },
          {
            label: "Sets",
            href: "https://www.yeti.com/kitchen/insulated-bowls?prefn1=productType&prefv1=Sets",
          },
        ],
      },
    ],
    promo: {
      title: "RAMBLER® BEVERAGE BUCKET",
      copy: "",
      label: "shop now",
      href: "https://www.yeti.com/drinkware/barware/21071503821.html",
      imageUrl:
        "background-image: url(https://yeti-webmedia.imgix.net/m/31ba23cba3b7f9f7/original/250083_Nav_BSQ_Global_Spot_Large_Lifestyle_NYE_Desktop-2x.jpg?auto=format,compress&w=450&h=450)",
    },
  },
  {
    label: "Cases & Storage",
    href: "",
    groups: [
      {
        label: "Shop All",
        href: "https://www.yeti.com/cases-and-storage",
        children: [],
      },
      {
        label: "Hard Cases",
        href: "https://www.yeti.com/cargo/hard-cases",
        children: [
          { label: "Shop All", href: "https://www.yeti.com/cargo/hard-cases" },
          {
            label: "GoBox 1",
            href: "https://www.yeti.com/cases-storage/gobox-1.html",
          },
          {
            label: "GoBox 15",
            href: "https://www.yeti.com/cargo/hard-cases/gobox-15.html",
          },
          {
            label: "GoBox 30",
            href: "https://www.yeti.com/cargo/hard-cases/gobox-30.html",
          },
          {
            label: "GoBox 60",
            href: "https://www.yeti.com/cargo/hard-cases/gobox-60.html",
          },
        ],
      },
      {
        label: "Buckets",
        href: "https://www.yeti.com/cases-and-storage/buckets",
        children: [
          { label: "Shop All", href: "https://www.yeti.com/cargo/buckets" },
          {
            label: "Loadout Bucket",
            href: "https://www.yeti.com/cargo/buckets/loadout-bucket.html",
          },
          {
            label: "Fully Loaded Bucket",
            href: "https://www.yeti.com/cases-and-storage/buckets?prefn1=productType&prefv1=Fully%20Loaded%20Bucket",
          },
        ],
      },
      {
        label: "Accessories",
        href: "https://www.yeti.com/cases-and-storage/accessories",
        children: [
          { label: "Shop All", href: "https://www.yeti.com/cargo/cargo-accessories" },
          {
            label: "Hard Cases",
            href: "https://www.yeti.com/cargo/cargo-accessories?prefn1=collection&prefv1=GoBox",
          },
          {
            label: "Bucket",
            href: "https://www.yeti.com/cargo/cargo-accessories?prefn1=collection&prefv1=Loadout%20Bucket",
          },
        ],
      },
    ],
    promo: {
      title: "UPGRADE YOUR TACKLE BOX",
      copy: "",
      label: "Shop GoBox",
      href: "https://www.yeti.com/26010000215.html",
      imageUrl:
        "background-image: url(https://yeti-webmedia.imgix.net/m/17776cad261232f4/original/240129_Nav_BSQ_Global_Spot_Large_Lifestyle_2025inItsPlace.jpg?auto=format,compress&w=400&h=400)",
    },
  },
  {
    label: "Outdoor Living",
    href: "",
    groups: [
      { label: "Shop All", href: "https://www.yeti.com/outdoor-living", children: [] },
      {
        label: "Outdoor Living Lifestyle",
        href: "https://www.yeti.com/outdoor-living",
        children: [
          { label: "Shop All", href: "https://www.yeti.com/outdoor-living" },
          { label: "Fire Pit", href: "https://www.yeti.com/outdoor-living/22030000054.html" },
          {
            label: "Chairs",
            href: "https://www.yeti.com/outdoor-living/outdoor-living-lifestyle/chairs",
          },
          {
            label: "Blankets",
            href: "https://www.yeti.com/outdoor-living/lowlands-blanket.html",
          },
          {
            label: "Cast Iron Skillet",
            href: "https://www.yeti.com/food/cookware/cast-iron-skillet.html",
          },
          {
            label: "YETI Presents Books",
            href: "https://www.yeti.com/outdoor-living/yeti-presents-books.html",
          },
          {
            label: "Accessories",
            href: "https://www.yeti.com/outdoor-living/accessories",
          },
        ],
      },
      {
        label: "Apparel",
        href: "https://www.yeti.com/outdoor-living/apparel",
        children: [
          { label: "Shop All", href: "https://www.yeti.com/outdoor-living/apparel" },
          {
            label: "Sweatshirts",
            href: "https://www.yeti.com/outdoor-living/apparel/sweatshirts",
          },
          {
            label: "T-Shirts",
            href: "https://www.yeti.com/outdoor-living/apparel/t-shirts",
          },
          {
            label: "Hats & Headgear",
            href: "https://www.yeti.com/outdoor-living/apparel/hats-and-headgear",
          },
          {
            label: "Sunshirts",
            href: "https://www.yeti.com/outdoor-living/apparel/sunshirts",
          },
        ],
      },
      {
        label: "Dogs",
        href: "https://www.yeti.com/dogs",
        children: [
          { label: "Shop All", href: "https://www.yeti.com/dogs" },
          { label: "Dog Bowls", href: "https://www.yeti.com/dogs/dog-bowls" },
        ],
      },
    ],
    promo: {
      title: "IT'S HOODIE SEASON",
      copy: "",
      label: "Shop Now",
      href: "https://www.yeti.com/outdoor-living/apparel/sweatshirts",
      imageUrl:
        "background-image: url(https://yeti-webmedia.imgix.net/m/7fc8bc2ee97e9fdc/original/240118_HP_BSQ_10-0_50_50_Lifestyle_2H25Apparel_Desktop-2x.jpg?auto=format,compress&w=450&h=450)",
    },
  },
  {
    label: "Fan Shop",
    href: "",
    groups: [
      { label: "Shop All", href: "https://www.yeti.com/fan-shop", children: [] },
      {
        label: "Featured Galleries",
        href: "",
        children: [
          { label: "Shop All", href: "https://www.yeti.com/fan-shop" },
          {
            label: "Hall Of Champions",
            href: "https://www.yeti.com/fan-shop/featured-galleries/hall-of-champions",
          },
          { label: "NFL", href: "https://www.yeti.com/fan-shop/nfl" },
          { label: "Collegiate", href: "https://www.yeti.com/fan-shop/collegiate" },
          { label: "NBA", href: "https://www.yeti.com/fan-shop/nba" },
          { label: "MLB", href: "https://www.yeti.com/fan-shop/mlb" },
          { label: "NHL", href: "https://www.yeti.com/fan-shop/nhl" },
          { label: "MLS", href: "https://www.yeti.com/fan-shop/mls" },
          {
            label: "Oracle Red Bull Racing",
            href: "https://www.yeti.com/fan-shop/oracle-red-bull-racing",
          },
        ],
      },
      {
        label: "Activity",
        href: "",
        children: [
          {
            label: "Youth Team Sports",
            href: "https://www.yeti.com/collections/trending-activities/youth-sports",
          },
          { label: "Soccer", href: "https://www.yeti.com/collections/shop-by-activity/soccer" },
          { label: "Golf", href: "https://www.yeti.com/collections/shop-by-activity/golf" },
          {
            label: "Tailgating",
            href: "https://www.yeti.com/collections/shop-by-activity/tailgating",
          },
          {
            label: "Fitness",
            href: "https://www.yeti.com/collections/shop-by-activity/fitness",
          },
          {
            label: "Equestrian & Rodeo",
            href: "https://www.yeti.com/collections/shop-by-activity/ranch-and-rodeo",
          },
          {
            label: "Hunting",
            href: "https://www.yeti.com/collections/shop-by-activity/hunting",
          },
          {
            label: "Fishing",
            href: "https://www.yeti.com/collections/shop-by-activity/fishing",
          },
        ],
      },
    ],
    promo: null,
  },
  {
    label: "Collections",
    href: "",
    groups: [
      {
        label: "Featured",
        href: "",
        children: [
          { label: "New Arrivals", href: "https://www.yeti.com/collections/new-arrivals" },
          { label: "Best Sellers", href: "https://www.yeti.com/best-sellers" },
          {
            label: "Seasonal Offers",
            href: "https://www.yeti.com/collections/featured/seasonal-offers",
          },
          { label: "Gifts", href: "https://www.yeti.com/gifts" },
          { label: "New to YETI", href: "https://www.yeti.com/new-to-yeti.html" },
          {
            label: "Sports Hydration",
            href: "https://www.yeti.com/drinkware/sports-hydration",
          },
          {
            label: "Fandom Collection",
            href: "https://www.yeti.com/drinkware/fandom-collection-chug-bottle-26oz.html",
          },
          {
            label: "Kids Collection",
            href: "https://www.yeti.com/collections/featured/kids-collection",
          },
          {
            label: "Stories From the Wild",
            href: "https://www.yeti.com/stories/all-stories.html",
          },
        ],
      },
      {
        label: "Trending Colors",
        href: "",
        children: [
          {
            label: "Shop All",
            href: "https://www.yeti.com/collections/trending-colors/shop-all",
          },
          {
            label: "Ridgeline",
            href: "https://www.yeti.com/collections/trending-colors/ridgeline",
          },
          {
            label: "Venom",
            href: "https://www.yeti.com/collections/trending-colors/venom",
          },
          {
            label: "Alpenglow",
            href: "https://www.yeti.com/collections/trending-colors/alpenglow",
          },
          {
            label: "Cherry Blossom",
            href: "https://www.yeti.com/collections/trending-colors/cherry-blossom",
          },
          {
            label: "Blue Camo",
            href: "https://www.yeti.com/collections/new-arrivals?prefn1=color&prefv1=Blue%20Camo#product-search-results",
          },
          {
            label: "Solar Flare",
            href: "https://www.yeti.com/collections/new-arrivals?prefn1=color&prefv1=Solar%20Flare#product-search-results",
          },
          {
            label: "Moon Dust",
            href: "https://www.yeti.com/collections/trending-colors/moon-dust",
          },
          {
            label: "Rescue Red",
            href: "https://www.yeti.com/collections/trending-colors/rescue-red",
          },
        ],
      },
      {
        label: "Trending Activities",
        href: "",
        children: [
          {
            label: "Shop All",
            href: "https://www.yeti.com/collections/trending-activities",
          },
          {
            label: "Youth Team Sports",
            href: "https://www.yeti.com/collections/trending-activities/youth-team-sports",
          },
          {
            label: "Fishing",
            href: "https://www.yeti.com/collections/trending-activities/fishing",
          },
          {
            label: "Fitness",
            href: "https://www.yeti.com/collections/trending-activities/fitness",
          },
          {
            label: "Travel",
            href: "https://www.yeti.com/collections/trending-activities/travel",
          },
          {
            label: "Hosting",
            href: "https://www.yeti.com/collections/trending-activities/hosting",
          },
          {
            label: "Daily Commute",
            href: "https://www.yeti.com/collections/trending-activities/daily-commute",
          },
          {
            label: "Hunting",
            href: "https://www.yeti.com/collections/trending-activities/hunting",
          },
          { label: "Snow", href: "https://www.yeti.com/collections/trending-activities/snow" },
        ],
      },
      {
        label: "Buying Guides",
        href: "",
        children: [
          {
            label: "Coolers",
            href: "https://www.yeti.com/buying-guides/cooler-buyers-guide.html",
          },
          {
            label: "Hard Coolers",
            href: "https://www.yeti.com/buying-guides/hard-cooler-buying-guide.html",
          },
          {
            label: "Soft Coolers",
            href: "https://www.yeti.com/buying-guides/soft-cooler-buying-guide.html",
          },
          {
            label: "Bags",
            href: "https://www.yeti.com/buying-guides/bags-buyers-guide.html",
          },
          {
            label: "Backpacks",
            href: "https://www.yeti.com/buying-guides/backpack-buying-guide.html",
          },
          {
            label: "Drinkware",
            href: "https://www.yeti.com/drinkware/all-day-drinkware",
          },
          {
            label: "Water Bottles",
            href: "https://www.yeti.com/buying-guides/water-bottles-buying-guide.html",
          },
          {
            label: "Coffee",
            href: "https://www.yeti.com/buying-guides/coffee-buying-guide.html",
          },
          {
            label: "Expert Advice",
            href: "https://www.yeti.com/stories/expert-advice.html",
          },
        ],
      },
    ],
    promo: {
      title: "Venom",
      copy: "For the cold blooded.",
      label: "shop now",
      href: "https://www.yeti.com/collections/trending-colors/venom",
      imageUrl:
        "background-image: url(https://yeti-webmedia.imgix.net/m/a9a105881761fc7/original/250190_Nav_BSQ_Global_Spot_Large_Lifestyle_Venom_SiloJug-2x.jpg?auto=format,compress&w=450&h=450)",
    },
  },
];

const YetiHeaderSectionFields: Fields<YetiHeaderSectionProps> = {
  utilityLinks: {
    label: "Utility Links",
    type: "array",
    arrayFields: {
      label: { label: "Label", type: "text" },
      href: { label: "Link", type: "text" },
      kind: {
        label: "Kind",
        type: "select",
        options: [
          { label: "Link", value: "link" },
          { label: "Modal", value: "modal" },
        ],
      },
    },
    defaultItemProps: {
      label: "Link",
      href: "#",
      kind: "link",
    },
    getItemSummary: (item: UtilityLink) => item.label,
  } as any,
  localeLabel: { label: "Locale Label", type: "text" },
  localeOptions: {
    label: "Locale Options",
    type: "array",
    arrayFields: {
      label: { label: "Label", type: "text" },
      href: { label: "Link", type: "text" },
    },
    defaultItemProps: {
      label: "Locale",
      href: "#",
    },
    getItemSummary: (item: LocaleOption) => item.label,
  } as any,
  primaryNavigation: {
    label: "Primary Navigation",
    type: "array",
    arrayFields: {
      label: { label: "Label", type: "text" },
      href: { label: "Link", type: "text" },
      groups: {
        label: "Groups",
        type: "array",
        arrayFields: {
          label: { label: "Label", type: "text" },
          href: { label: "Link", type: "text" },
          children: {
            label: "Children",
            type: "array",
            arrayFields: {
              label: { label: "Label", type: "text" },
              href: { label: "Link", type: "text" },
            },
            defaultItemProps: {
              label: "Child Link",
              href: "#",
            },
            getItemSummary: (item: NavigationChild) => item.label,
          },
        },
        defaultItemProps: {
          label: "Group",
          href: "",
          children: [],
        },
        getItemSummary: (item: NavigationGroup) => item.label,
      },
      promo: {
        label: "Promo",
        type: "object",
        objectFields: {
          title: { label: "Title", type: "text" },
          copy: { label: "Copy", type: "text" },
          label: { label: "Button Label", type: "text" },
          href: { label: "Button Link", type: "text" },
          imageUrl: { label: "Image Style", type: "text" },
        },
      },
    },
    defaultItemProps: {
      label: "Navigation Item",
      href: "",
      groups: [],
      promo: {
        title: "",
        copy: "",
        label: "",
        href: "",
        imageUrl: "",
      },
    },
    getItemSummary: (item: NavigationItem) => item.label,
  } as any,
};

const linkStyle = {
  color: "inherit",
  textDecoration: "none",
};

const extractPromoUrl = (value?: string) => {
  if (!value) return "";
  const match = value.match(/url\((.*?)\)/);
  return match?.[1] ?? "";
};

const ActionLink = ({
  href,
  label,
  target,
}: {
  href: string;
  label: string;
  target?: string;
}) => (
  <Link
    cta={{
      link: href,
      linkType: "URL",
      label,
    }}
    target={target}
    rel={target ? "noopener noreferrer" : undefined}
    style={linkStyle}
  >
    {label}
  </Link>
);

export const YetiHeaderSectionComponent: PuckComponent<YetiHeaderSectionProps> = (
  props,
) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <Box
      as="section"
      position="relative"
      zIndex={10}
      bg="#ffffff"
      onMouseLeave={() => setActiveIndex(null)}
    >
      <Box display={{ base: "none", xl: "block" }} bg="#002b45" color="#ffffff">
        <Flex
          maxW="1540px"
          mx="auto"
          align="center"
          minH="60px"
          px="40px"
          justify="space-between"
        >
          <Flex align="center" gap="45px" ml="146px">
            {props.utilityLinks.map((item) =>
              item.kind === "link" ? (
                <Box
                  key={`${item.label}-${item.href}`}
                  color="#ffffff"
                  fontFamily="'urw-din', 'Oswald', sans-serif"
                  fontSize="14px"
                  fontWeight={500}
                  lineHeight="60px"
                  letterSpacing="0.07px"
                  textDecoration="underline"
                  textUnderlineOffset="5px"
                >
                  <ActionLink href={item.href} label={item.label} />
                </Box>
              ) : (
                <Text
                  key={`${item.label}-${item.href}`}
                  color="#ffffff"
                  fontFamily="'urw-din', 'Oswald', sans-serif"
                  fontSize="14px"
                  fontWeight={500}
                  lineHeight="60px"
                  letterSpacing="0.07px"
                  textDecoration="underline"
                  textUnderlineOffset="5px"
                >
                  {item.label}
                </Text>
              ),
            )}
          </Flex>
          <Flex align="center" gap="14px" mr="40px">
            <Text fontSize="15px">▾</Text>
            <Text
              fontFamily="'urw-din', 'Oswald', sans-serif"
              fontSize="14px"
              fontWeight={500}
              lineHeight="60px"
              letterSpacing="0.07px"
            >
              {props.localeLabel}
            </Text>
          </Flex>
        </Flex>
      </Box>

      <Box borderBottom="1px solid #ddd">
        <Flex
          maxW="1540px"
          mx="auto"
          minH={{ base: "72px", xl: "80px" }}
          px={{ base: "20px", xl: "40px" }}
          align="center"
          justify="space-between"
          bg="#ffffff"
        >
          <Text
            color={{ base: "#002b45", xl: "#002b45" }}
            fontFamily="'stratum-1-web', 'Barlow Condensed', sans-serif"
            fontSize="36px"
            fontWeight={900}
            letterSpacing="1px"
            lineHeight="1"
            minW="106px"
          >
            YETI
          </Text>

          <Flex
            display={{ base: "none", xl: "flex" }}
            align="center"
            justify="center"
            gap="30px"
            flex="1"
            mx="30px"
          >
            {props.primaryNavigation.map((item, index) => {
              const isChip = index === 0;
              const isActive = activeIndex === index;
              const hasMegaMenu = item.groups.length > 0;

              if (isChip) {
                return (
                  <Box
                    key={item.label}
                    border="1px solid #f4b44e"
                    borderRadius="4px"
                    px="14px"
                    py="7px"
                    color="#002b45"
                    fontFamily="'stratum-1-web', 'Barlow Condensed', sans-serif"
                    fontSize="12px"
                    fontWeight={900}
                    letterSpacing="0.6px"
                    textTransform="uppercase"
                  >
                    <ActionLink href={item.href} label={item.label} />
                  </Box>
                );
              }

              return (
                <Box key={item.label} position="relative">
                  <Text
                    role="button"
                    color="#002b45"
                    cursor={hasMegaMenu ? "pointer" : "default"}
                    fontFamily="'urw-din', 'Oswald', sans-serif"
                    fontSize="16px"
                    fontWeight={500}
                    lineHeight="1.5"
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() =>
                      setActiveIndex((current) => (current === index ? null : index))
                    }
                    _after={{
                      content: '""',
                      position: "absolute",
                      left: "50%",
                      bottom: "-20px",
                      width: isActive ? "100%" : "0",
                      h: "3px",
                      bg: "#002b45",
                      transform: "translateX(-50%)",
                      transition: "width 0.2s cubic-bezier(.37,0,.63,1)",
                    }}
                  >
                    {item.label}
                  </Text>
                </Box>
              );
            })}
          </Flex>

          <Flex align="center" gap={{ base: "14px", xl: "18px" }}>
            <Flex
              display={{ base: "none", xl: "flex" }}
              align="center"
              border="1px solid #ddd"
              px="12px"
              py="8px"
              w="170px"
              borderRadius="2px"
              color="#8a8a8a"
            >
              <Text mr="10px">⌕</Text>
              <Text fontSize="14px" fontFamily="'urw-din', 'Oswald', sans-serif">
                Search ...
              </Text>
            </Flex>
            <Text color="#002b45" fontSize="18px">
              👜
            </Text>
            <Text color="#002b45" fontSize="18px">
              👤
            </Text>
          </Flex>
        </Flex>
      </Box>

      {activeIndex !== null &&
        props.primaryNavigation[activeIndex] &&
        props.primaryNavigation[activeIndex].groups.length > 0 && (
          <Box
            display={{ base: "none", xl: "block" }}
            position="absolute"
            top="100%"
            left={0}
            right={0}
            bg="rgba(255,255,255,0.94)"
            backdropFilter="blur(40px)"
            borderBottom="1px solid #ddd"
          >
            <Flex
              maxW="1540px"
              mx="auto"
              px="40px"
              py="40px"
              align="flex-start"
              justify="space-between"
              gap="25px"
            >
              <Flex flex="1" justify="center" gap="25px">
                {props.primaryNavigation[activeIndex].groups.map((group) => (
                  <Box key={`${props.primaryNavigation[activeIndex].label}-${group.label}`} maxW="165px">
                    {group.href ? (
                      <Text
                        color="#002b45"
                        fontFamily="'urw-din', 'Oswald', sans-serif"
                        fontSize="16px"
                        fontWeight={500}
                        lineHeight="1.5"
                        mb={group.children.length ? "10px" : "0"}
                      >
                        <ActionLink href={group.href} label={group.label} />
                      </Text>
                    ) : (
                      <Text
                        color="#002b45"
                        fontFamily="'urw-din', 'Oswald', sans-serif"
                        fontSize="16px"
                        fontWeight={500}
                        lineHeight="1.5"
                        mb={group.children.length ? "10px" : "0"}
                      >
                        {group.label}
                      </Text>
                    )}
                    {group.children.map((child) => (
                      <Text
                        key={`${group.label}-${child.label}`}
                        color="#002b45"
                        fontFamily="'urw-din', 'Oswald', sans-serif"
                        fontSize="14px"
                        fontWeight={400}
                        lineHeight="1.25"
                        mb="10px"
                      >
                        <ActionLink href={child.href} label={child.label} />
                      </Text>
                    ))}
                  </Box>
                ))}
              </Flex>

              {props.primaryNavigation[activeIndex].promo && (
                <Box
                  flex="0 0 255px"
                  borderRadius="6px"
                  overflow="hidden"
                  bg="#002b45"
                  backgroundImage={`linear-gradient(to top, rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.15)), url(${extractPromoUrl(props.primaryNavigation[activeIndex].promo?.imageUrl)})`}
                  backgroundSize="cover"
                  backgroundPosition="center"
                  minH="255px"
                  display="flex"
                  alignItems="flex-end"
                >
                  <Box p="20px">
                    <Text
                      color="#ffffff"
                      fontFamily="'stratum-1-web', 'Barlow Condensed', sans-serif"
                      fontSize="24px"
                      fontWeight={900}
                      lineHeight="1"
                      letterSpacing="1.1px"
                      textTransform="uppercase"
                    >
                      {props.primaryNavigation[activeIndex].promo?.title}
                    </Text>
                    {props.primaryNavigation[activeIndex].promo?.copy && (
                      <Text
                        mt="8px"
                        color="#ffffff"
                        fontFamily="'urw-din', 'Oswald', sans-serif"
                        fontSize="14px"
                        lineHeight="1.5"
                      >
                        {props.primaryNavigation[activeIndex].promo?.copy}
                      </Text>
                    )}
                    <Text
                      mt="16px"
                      color="#ffffff"
                      fontFamily="'stratum-1-web', 'Barlow Condensed', sans-serif"
                      fontSize="14px"
                      fontWeight={900}
                      letterSpacing="0.7px"
                      textTransform="uppercase"
                    >
                      <ActionLink
                        href={props.primaryNavigation[activeIndex].promo?.href || "#"}
                        label={props.primaryNavigation[activeIndex].promo?.label || ""}
                      />
                    </Text>
                  </Box>
                </Box>
              )}
            </Flex>
          </Box>
        )}
    </Box>
  );
};

export const YetiHeaderSection: ComponentConfig<YetiHeaderSectionProps> = {
  label: "Yeti Header",
  fields: YetiHeaderSectionFields,
  defaultProps: {
    utilityLinks: defaultUtilityLinks,
    localeLabel: "USA / EN",
    localeOptions: defaultLocaleOptions,
    primaryNavigation: defaultPrimaryNavigation,
  },
  render: YetiHeaderSectionComponent,
};
