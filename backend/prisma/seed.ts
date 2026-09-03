import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { dedupeAgentAssignments } from './dedupe-agent-assignments';
import { PLATFORM_NAME, PLATFORM_ACCOUNTANT_LABEL } from '../src/constants/platform';

const prisma = new PrismaClient();

const ROLES = [
  { id: 1, roleName: 'Crop Farmer' },
  { id: 2, roleName: 'Livestock Farmer' },
  { id: 3, roleName: 'Farmer Handler' },
  { id: 4, roleName: 'Buyer' },
  { id: 5, roleName: 'Buyer Handler' },
  { id: 6, roleName: PLATFORM_ACCOUNTANT_LABEL },
  { id: 7, roleName: 'Admin' },
  { id: 8, roleName: 'Researcher' },
  { id: 9, roleName: 'Student' },
  { id: 10, roleName: 'CTO' },
  { id: 11, roleName: 'Communication Officer' },
  { id: 12, roleName: 'Organization Fellow' },
];

const PERMISSIONS = [
  'create_listing', 'manage_commodities', 'view_farmer_preview', 'view_full_farmer_data',
  'request_connection', 'approve_connection', 'manage_payments', 'verify_users',
  'manage_listings', 'negotiate_as_farmer', 'represent_farmer', 'search_farmers',
  'negotiate_as_buyer', 'represent_buyer', 'manage_packages', 'view_audit_logs',
  'manage_users', 'send_messages', 'purchase_access',
  'create_publication', 'manage_publications', 'view_publications', 'purchase_publication',
  'manage_ads',
];

const ROLE_PERMS: Record<number, string[]> = {
  1: ['create_listing', 'manage_commodities', 'view_farmer_preview', 'send_messages', 'view_publications', 'purchase_access', 'purchase_publication', 'request_connection'],
  2: ['create_listing', 'manage_commodities', 'view_farmer_preview', 'send_messages', 'view_publications', 'purchase_access', 'purchase_publication', 'request_connection'],
  12: ['create_listing', 'manage_commodities', 'view_farmer_preview', 'send_messages', 'view_publications', 'purchase_access', 'purchase_publication', 'request_connection'],
  3: ['view_farmer_preview', 'view_full_farmer_data', 'manage_listings', 'negotiate_as_farmer', 'represent_farmer', 'send_messages', 'view_publications'],
  4: ['view_farmer_preview', 'view_full_farmer_data', 'request_connection', 'negotiate_as_buyer', 'represent_buyer', 'purchase_access', 'send_messages', 'view_publications', 'purchase_publication'],
  5: ['view_farmer_preview', 'view_full_farmer_data', 'request_connection', 'search_farmers', 'negotiate_as_buyer', 'represent_buyer', 'send_messages', 'view_publications'],
  6: ['manage_payments', 'manage_packages', 'approve_connection', 'view_publications'],
  7: ['manage_payments', 'verify_users', 'manage_packages', 'view_audit_logs', 'manage_users', 'view_full_farmer_data', 'approve_connection', 'view_publications', 'manage_ads'],
  8: ['create_publication', 'manage_publications', 'view_publications', 'send_messages', 'view_farmer_preview', 'view_full_farmer_data', 'request_connection', 'negotiate_as_buyer', 'represent_buyer', 'purchase_access'],
  9: ['view_publications', 'purchase_publication', 'send_messages'],
  10: ['view_audit_logs', 'view_publications', 'view_full_farmer_data', 'manage_packages'],
  11: ['send_messages', 'view_publications', 'approve_connection'],
};

async function main() {
  console.log(`🌱 Seeding ${PLATFORM_NAME}...`);
  await dedupeAgentAssignments();

  const legacyStudents = await prisma.user.findMany({ where: { roleId: 9 } });
  for (const student of legacyStudents) {
    await prisma.user.update({ where: { id: student.id }, data: { roleId: 4 } });
    await prisma.buyerProfile.upsert({
      where: { userId: student.id },
      create: { userId: student.id },
      update: {},
    });
  }
  if (legacyStudents.length > 0) {
    console.log(`Migrated ${legacyStudents.length} legacy student account(s) to Client (Buyer) role`);
  }

  for (const role of ROLES) {
    await prisma.role.upsert({ where: { id: role.id }, update: { roleName: role.roleName }, create: role });
  }

  for (let i = 0; i < PERMISSIONS.length; i++) {
    await prisma.permission.upsert({
      where: { id: i + 1 },
      update: { permissionName: PERMISSIONS[i] },
      create: { id: i + 1, permissionName: PERMISSIONS[i] },
    });
  }

  for (const [roleId, perms] of Object.entries(ROLE_PERMS)) {
    for (const permName of perms) {
      const perm = await prisma.permission.findUnique({ where: { permissionName: permName } });
      if (perm) {
        await prisma.rolePermission.upsert({
          where: { roleId_permissionId: { roleId: parseInt(roleId), permissionId: perm.id } },
          update: {},
          create: { roleId: parseInt(roleId), permissionId: perm.id },
        });
      }
    }
  }

  const cropCategories: Record<string, Record<string, string[]>> = {
    Cereals: {
      Maize: ['White maize', 'Yellow maize'],
      Rice: ['Local rice', 'Imported rice', 'Jasmine rice', 'Ofada rice'],
      Millet: ['Pearl millet', 'Finger millet'],
      Sorghum: ['Red sorghum', 'White sorghum'],
      Fonio: ['White fonio', 'Black fonio'],
      Wheat: ['Bread wheat', 'Durum wheat'],
    },
    'Roots & Tubers': {
      Cassava: ['Sweet cassava', 'Industrial cassava'],
      Yam: ['White yam', 'Water yam', 'Yellow yam', 'Puna yam'],
      Cocoyam: ['Taro cocoyam', 'Colocasia cocoyam'],
      Plantain: ['French plantain', 'False horn plantain', 'Apem plantain'],
      'Sweet Potato': ['Orange flesh', 'White flesh'],
      'Irish Potato': ['Red skin', 'White skin'],
      Taro: ['Eddoe taro', 'Dasheen taro'],
    },
    Vegetables: {
      Tomato: ['Roma tomato', 'Cherry tomato', 'Beef tomato'],
      Pepper: ['Bell pepper', 'Scotch bonnet', "Bird's eye chili", 'Habanero', 'Green bell', 'Red bell'],
      Onion: ['Red onion', 'White onion', 'Spring onion'],
      'Garden Eggs': ['White garden egg', 'Green garden egg', 'Purple garden egg'],
      Okra: ['Green okra', 'Red okra'],
      Cabbage: ['Green cabbage', 'Red cabbage'],
      Lettuce: ['Iceberg lettuce', 'Romaine lettuce'],
      Cucumber: ['Slicing cucumber', 'Pickling cucumber'],
      Carrot: ['Nantes carrot', 'Chantenay carrot'],
      Eggplant: ['Long purple', 'Round white'],
      Spinach: ['English spinach', 'Amaranth leaves'],
      Kontomire: ['Cocoyam leaves', 'Sweet potato leaves'],
      'Green Beans': ['French beans', 'Runner beans'],
    },
    Fruits: {
      Mango: ['Keitt mango', 'Kent mango', 'Local mango', 'Alphonso mango'],
      Pineapple: ['Smooth cayenne', 'Sugar loaf', 'MD2 golden'],
      Papaya: ['Solo papaya', 'Red lady papaya'],
      Orange: ['Valencia orange', 'Local sweet orange', 'Navel orange'],
      Banana: ['Cavendish banana', 'Red banana', 'Apple banana'],
      Watermelon: ['Crimson sweet', 'Sugar baby'],
      Coconut: ['Green coconut', 'Dry coconut'],
      Avocado: ['Hass avocado', 'Local avocado', 'Fuerte avocado'],
      Cashew: ['Raw cashew nut', 'Roasted cashew nut'],
      Guava: ['Pink guava', 'White guava'],
      'Passion Fruit': ['Purple passion fruit', 'Yellow passion fruit'],
      Lemon: ['Eureka lemon', 'Local lemon'],
      Lime: ['Key lime', 'Persian lime'],
      Grapefruit: ['Pink grapefruit', 'White grapefruit'],
    },
    'Tree Crops': {
      Cocoa: ['Fine flavour', 'Bulk grade', 'Organic cocoa'],
      Coffee: ['Arabica', 'Robusta', 'Excelsa'],
      'Oil Palm': ['Tenera', 'Dura', 'Pisifera'],
      Shea: ['Shea nuts', 'Shea butter grade'],
      Rubber: ['Latex grade', 'Cup lump'],
    },
    Legumes: {
      Groundnut: ['Runner groundnut', 'Virginia groundnut', 'Spanish groundnut'],
      Cowpea: ['Red cowpea', 'White cowpea', 'Brown cowpea', 'Black-eyed pea'],
      Soybean: ['Yellow soybean', 'Black soybean'],
      'Bambara Beans': ['Red bambara', 'White bambara'],
      'Pigeon Pea': ['Short duration', 'Long duration'],
      Beans: ['Kidney beans', 'Black beans', 'Navy beans'],
    },
    'Spices & Herbs': {
      Ginger: ['Yellow ginger', 'Black ginger'],
      Turmeric: ['Fresh turmeric', 'Dried turmeric'],
      Moringa: ['Moringa leaves', 'Moringa seeds'],
      'African Nutmeg': ['Whole nutmeg', 'Ground nutmeg'],
      Garlic: ['Hardneck garlic', 'Softneck garlic'],
      'Hot Pepper': ['Cayenne pepper', 'Shito pepper'],
    },
    'Other Crops': {
      Sugarcane: ['Chewing cane', 'Industrial cane'],
      Cotton: ['Upland cotton', 'Long staple cotton'],
      Kenaf: ['Fibre kenaf', 'Seed kenaf'],
      Tobacco: ['Virginia tobacco', 'Burley tobacco'],
      Sesame: ['White sesame', 'Brown sesame'],
    },
  };

  const livestockData: Record<string, string[]> = {
    Cattle: ['Beef cattle', 'Dairy cattle', 'Dual-purpose cattle'],
    Goats: ['West African Dwarf', 'Sahelian goat', 'Boer cross'],
    Sheep: ['West African Dwarf sheep', 'Djallonke sheep', 'Sahelian sheep'],
    Poultry: ['Broiler', 'Layer', 'Local fowl', 'Guinea fowl'],
    Pigs: ['Large White', 'Landrace', 'Local pig'],
    Rabbits: ['New Zealand White', 'California rabbit'],
    Grasscutter: ['Domesticated grasscutter'],
    Snails: ['Giant African snail', 'Achatina snail'],
    Bees: ['Honey bees', 'Stingless bees'],
    Fish: ['Tilapia', 'Catfish', 'Heterotis'],
  };

  async function seedCategoryCommodities(
    categoryName: string,
    commodities: Record<string, string[]>
  ) {
    const category = await prisma.commodityCategory.upsert({
      where: { name: categoryName },
      update: {},
      create: { name: categoryName },
    });
    for (const [name, variants] of Object.entries(commodities)) {
      const c = await prisma.commodity.upsert({
        where: { categoryId_name: { categoryId: category.id, name } },
        update: {},
        create: { categoryId: category.id, name },
      });
      for (const v of variants) {
        await prisma.commodityVariant.upsert({
          where: { commodityId_variantName: { commodityId: c.id, variantName: v } },
          update: {},
          create: { commodityId: c.id, variantName: v },
        });
      }
    }
  }

  for (const [categoryName, commodities] of Object.entries(cropCategories)) {
    await seedCategoryCommodities(categoryName, commodities);
  }

  await seedCategoryCommodities('Livestock', livestockData);

  const legacyCrop = await prisma.commodityCategory.upsert({
    where: { name: 'Crop' },
    update: {},
    create: { name: 'Crop' },
  });
  const legacyCommodities: Record<string, string[]> = {
    Maize: ['White maize', 'Yellow maize'],
    Rice: ['Local rice', 'Imported rice'],
    Cocoa: ['Fine flavour', 'Bulk grade'],
    Tomato: ['Roma tomato', 'Cherry tomato'],
    Cassava: ['Sweet cassava', 'Industrial cassava'],
  };
  for (const [name, variants] of Object.entries(legacyCommodities)) {
    const c = await prisma.commodity.upsert({
      where: { categoryId_name: { categoryId: legacyCrop.id, name } },
      update: {},
      create: { categoryId: legacyCrop.id, name },
    });
    for (const v of variants) {
      await prisma.commodityVariant.upsert({
        where: { commodityId_variantName: { commodityId: c.id, variantName: v } },
        update: {},
        create: { commodityId: c.id, variantName: v },
      });
    }
  }

  await prisma.accessPackage.upsert({
    where: { id: '00000000-0000-0000-0000-000000000001' },
    update: { price: 50 },
    create: { id: '00000000-0000-0000-0000-000000000001', name: 'Basic Buyer Access', price: 50, durationDays: 30 },
  });
  await prisma.accessPackage.upsert({
    where: { id: '00000000-0000-0000-0000-000000000002' },
    update: { price: 120 },
    create: { id: '00000000-0000-0000-0000-000000000002', name: 'Premium Buyer Access', price: 120, durationDays: 90 },
  });
  await prisma.accessPackage.upsert({
    where: { id: '00000000-0000-0000-0000-000000000003' },
    update: { price: 1, name: 'Farm Access' },
    create: {
      id: '00000000-0000-0000-0000-000000000003',
      name: 'Farm Access',
      price: 1,
      durationDays: 36500,
    },
  });

  const hash = await bcrypt.hash('Password123!', 12);
  await prisma.user.upsert({
    where: { email: 'admin@ani.gh' },
    update: { roleId: 7, verificationStatus: 'VERIFIED' },
    create: {
      firstName: 'Platform',
      lastName: 'Admin',
      email: 'admin@ani.gh',
      phone: '+233500000002',
      passwordHash: hash,
      country: 'Ghana',
      region: 'Greater Accra',
      city: 'Accra',
      roleId: 7,
      verificationStatus: 'VERIFIED',
    },
  });

  console.log('✅ Seed complete. Admin login: admin@ani.gh (Password123! until you change it).');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e.message || e);
    if (e.code === 'P1001') {
      console.error('\nPostgreSQL is not running. Start it first:');
      console.error('  docker compose up -d');
      console.error('Then run: npm run db:setup');
    }
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
