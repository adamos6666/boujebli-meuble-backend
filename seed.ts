import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Début du seeding...');

  // Ajouter des produits standards avec de vraies images
  const produits = [
    // Cuisines (4 produits)
    {
      titre: "Cuisine Vintage",
      description: "Cuisine élégante style vintage avec finitions soignées en bois massif. Caractéristiques : placage chêne, poignées en laiton, plan de travail en granit, électroménager intégré.",
      image: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
      langues: ["fr", "en", "ar"]
    },
    {
      titre: "Cuisine Velvety",
      description: "Cuisine moderne avec revêtement velours et design épuré. Finitions mat, portes sans poignées, éclairage LED intégré, plan de travail en quartz.",
      image: "https://images.pexels.com/photos/1571461/pexels-photo-1571461.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
      langues: ["fr", "en", "ar"]
    },
    {
      titre: "Cuisine Eternal Shine",
      description: "Cuisine avec finitions brillantes et éclairage intégré. Portes laquées brillantes, miroirs décoratifs, système d'éclairage ambiant, plan de travail en marbre.",
      image: "https://images.pexels.com/photos/1571462/pexels-photo-1571462.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
      langues: ["fr", "en", "ar"]
    },
    {
      titre: "Cuisine Moderne",
      description: "Cuisine contemporaine avec équipements haut de gamme. Design minimaliste, finitions premium, électroménager intégré, plan de travail en quartz.",
      image: "https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
      langues: ["fr", "en", "ar"]
    },
    // Portes (2 produits)
    {
      titre: "Porte Chêne Intérieur",
      description: "Porte intérieure en chêne massif avec finitions naturelles. Dimensions standard, quincaillerie en laiton, isolation phonique, finition cire naturelle.",
      image: "https://images.pexels.com/photos/1571464/pexels-photo-1571464.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
      langues: ["fr", "en", "ar"]
    },
    {
      titre: "Porte Pivot Extérieur",
      description: "Porte extérieure à pivot avec sécurité renforcée. Bois exotique, vitrage isolant, serrure multipoints, finition anti-UV.",
      image: "https://images.pexels.com/photos/1571465/pexels-photo-1571465.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
      langues: ["fr", "en", "ar"]
    },
    // Dressing (2 produits)
    {
      titre: "Dressing à la Française",
      description: "Dressing élégant style français avec placage noble. Placage chêne, miroirs intégrés, éclairage LED, tiroirs coulissants.",
      image: "https://images.pexels.com/photos/1571466/pexels-photo-1571466.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
      langues: ["fr", "en", "ar"]
    },
    {
      titre: "Dressing Coulissant",
      description: "Dressing avec portes coulissantes pour gain d'espace. Système de rails, portes miroir, rangements optimisés, finition laquée.",
      image: "https://images.pexels.com/photos/1571467/pexels-photo-1571467.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
      langues: ["fr", "en", "ar"]
    },
    // Meubles (4 produits)
    {
      titre: "Meuble TV",
      description: "Meuble TV moderne et fonctionnel avec rangement optimisé. Bois massif, tiroirs coulissants, compartiments pour câbles, finition cire.",
      image: "https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
      langues: ["fr", "en", "ar"]
    },
    {
      titre: "Meuble Salle de Bain",
      description: "Meuble de salle de bain élégant et résistant à l'humidité. Bois traité, vasque intégrée, tiroirs étanches, finition hydrofuge.",
      image: "https://images.pexels.com/photos/1571469/pexels-photo-1571469.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
      langues: ["fr", "en", "ar"]
    },
    {
      titre: "Meuble Bureau",
      description: "Bureau design avec rangements intégrés. Bois massif, tiroirs coulissants, compartiments organisés, finition moderne.",
      image: "https://images.pexels.com/photos/1571470/pexels-photo-1571470.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
      langues: ["fr", "en", "ar"]
    },
    {
      titre: "Meuble Chambre",
      description: "Meuble de chambre moderne et épuré. Design contemporain, rangements optimisés, finitions soignées, matériaux nobles.",
      image: "https://images.pexels.com/photos/1571471/pexels-photo-1571471.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
      langues: ["fr", "en", "ar"]
    }
  ];

  for (const produit of produits) {
    // Vérifier si le produit existe déjà
    const existingProduit = await prisma.produitStandard.findFirst({
      where: { titre: produit.titre }
    });

    if (existingProduit) {
      // Mettre à jour le produit existant
      await prisma.produitStandard.update({
        where: { id: existingProduit.id },
        data: produit,
      });
      console.log(`✅ Produit mis à jour: ${produit.titre}`);
    } else {
      // Créer un nouveau produit
      await prisma.produitStandard.create({
        data: produit,
      });
      console.log(`✅ Produit créé: ${produit.titre}`);
    }
  }

  // Ajouter des traductions
  const traductions = [
    // Français
    { cle: "catalogue_title", valeur: "Catalogue", langue: "fr" },
    { cle: "catalogue_subtitle", valeur: "Découvrez notre collection complète", langue: "fr" },
    { cle: "cuisines_title", valeur: "Cuisines", langue: "fr" },
    { cle: "portes_title", valeur: "Portes", langue: "fr" },
    { cle: "dressing_title", valeur: "Dressing", langue: "fr" },
    { cle: "meubles_title", valeur: "Meubles", langue: "fr" },
    
    // Anglais
    { cle: "catalogue_title", valeur: "Catalog", langue: "en" },
    { cle: "catalogue_subtitle", valeur: "Discover our complete collection", langue: "en" },
    { cle: "cuisines_title", valeur: "Kitchens", langue: "en" },
    { cle: "portes_title", valeur: "Doors", langue: "en" },
    { cle: "dressing_title", valeur: "Dressing", langue: "en" },
    { cle: "meubles_title", valeur: "Furniture", langue: "en" },
    
    // Arabe
    { cle: "catalogue_title", valeur: "الكاتالوج", langue: "ar" },
    { cle: "catalogue_subtitle", valeur: "اكتشف مجموعتنا الكاملة", langue: "ar" },
    { cle: "cuisines_title", valeur: "المطابخ", langue: "ar" },
    { cle: "portes_title", valeur: "الأبواب", langue: "ar" },
    { cle: "dressing_title", valeur: "الخزائن", langue: "ar" },
    { cle: "meubles_title", valeur: "الأثاث", langue: "ar" }
  ];

  for (const traduction of traductions) {
    // Vérifier si la traduction existe déjà
    const existingTraduction = await prisma.traduction.findFirst({
      where: {
        cle: traduction.cle,
        langue: traduction.langue
      }
    });

    if (existingTraduction) {
      // Mettre à jour la traduction existante
      await prisma.traduction.update({
        where: { id: existingTraduction.id },
        data: traduction,
      });
      console.log(`✅ Traduction mise à jour: ${traduction.cle} (${traduction.langue})`);
    } else {
      // Créer une nouvelle traduction
      await prisma.traduction.create({
        data: traduction,
      });
      console.log(`✅ Traduction créée: ${traduction.cle} (${traduction.langue})`);
    }
  }

  console.log('🎉 Seeding terminé avec succès!');
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 