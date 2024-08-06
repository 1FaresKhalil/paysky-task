<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useAppConf } from '@/composables/useAppConf';
import { useStore } from '@/stores/useStore';
import type { Category } from '@/stores/useStore';
const { backgroundIsWhite } = useAppConf();
backgroundIsWhite();

onUnmounted(() => backgroundIsWhite(false));

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const store = useStore();

const currentCategory = ref<{ name: string }>({ name: '' });
const isEditing = ref(false);
const currentEditId = ref<number | null>(null);

const touched = ref({
  name: false,
});

const addCategory = () => {
  const newCategory = {
    id:
      store.categories.length > 0
        ? store.categories[store.categories.length - 1].id + 1
        : 1,
    name: currentCategory.value.name,
    productCount: 0,
  };
  store.addCategory(newCategory);
  resetCurrentCategory();
};

const editCategory = () => {
  if (currentEditId.value !== null) {
    const editedCategory = {
      id: currentEditId.value,
      name: currentCategory.value.name,
      productCount: store.products.filter(
        (product) => product.category === currentCategory.value.name
      ).length,
    };
    store.editCategory(editedCategory);
    resetCurrentCategory();
    isEditing.value = false;
    currentEditId.value = null;
  }
};

const deleteCategory = (id: number) => {
  store.deleteCategory(id);
};

const setCategoryToEdit = (category: Category) => {
  currentCategory.value = { name: category.name };
  isEditing.value = true;
  currentEditId.value = category.id;
  resetTouched();
};

const resetCurrentCategory = () => {
  currentCategory.value = { name: '' };
  resetTouched();
};

const resetTouched = () => {
  touched.value = { name: false };
};

const isFormValid = computed(() => {
  return currentCategory.value.name.trim() !== '';
});

onMounted(() => {
  if (!store.categories.length) store.fetchCategories();
});

const categories = computed(() => store.categories);
</script>

<template>
  <Dialog>
    <DialogTrigger as-child>
      <Button
        variant="outline"
        @click="
          isEditing = false;
          resetCurrentCategory();
        "
        >Add category</Button
      >
    </DialogTrigger>
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{{ isEditing ? 'Edit' : 'Add' }} category</DialogTitle>
        <DialogDescription>{{
          isEditing ? 'Edit the category details' : 'Add a new category'
        }}</DialogDescription>
      </DialogHeader>
      <div class="grid gap-4 py-4">
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="name" class="text-right">Name</Label>
          <Input
            v-model="currentCategory.name"
            id="name"
            class="col-span-3 !ring-offset-0 !ring-0 border-grey-100"
            @blur="touched.name = true"
            :class="{
              'border-red-500':
                touched.name && currentCategory.name.trim() === '',
            }"
          />
        </div>
      </div>
      <DialogFooter>
        <DialogClose as-child>
          <Button
            @click="isEditing ? editCategory() : addCategory()"
            type="submit"
            :disabled="!isFormValid"
            >{{ isEditing ? 'Save' : 'Add' }}</Button
          >
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  </Dialog>
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead class="w-[100px]">ID</TableHead>
        <TableHead>Name</TableHead>
        <TableHead>Product Count</TableHead>
        <TableHead class="text-right">Actions</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow v-for="category in categories" :key="category.id">
        <TableCell class="font-medium">{{ category.id }}</TableCell>
        <TableCell>{{ category.name }}</TableCell>
        <TableCell>{{ category.productCount }}</TableCell>
        <TableCell class="text-right">
          <Dialog>
            <DialogTrigger as-child>
              <Button @click="setCategoryToEdit(category)" variant="outline"
                >Edit</Button
              >
            </DialogTrigger>
            <DialogContent class="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit category</DialogTitle>
                <DialogDescription>Edit the category details</DialogDescription>
              </DialogHeader>
              <div class="grid gap-4 py-4">
                <div class="grid grid-cols-4 items-center gap-4">
                  <Label for="name" class="text-right">Name</Label>
                  <Input
                    v-model="currentCategory.name"
                    id="name"
                    class="col-span-3 !ring-offset-0 !ring-0 border-grey-100"
                    @blur="touched.name = true"
                    :class="{
                      'border-red-500':
                        touched.name && currentCategory.name.trim() === '',
                    }"
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose as-child>
                  <Button
                    @click="editCategory()"
                    type="submit"
                    :disabled="!isFormValid"
                    >Save</Button
                  >
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button
            @click="() => deleteCategory(category.id)"
            variant="outline"
            class="ml-2"
            >Delete</Button
          >
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
</template>
