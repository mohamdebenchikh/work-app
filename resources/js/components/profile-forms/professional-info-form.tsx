import { Transition } from '@headlessui/react';
import { Form } from '@inertiajs/react';
import { useState } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectTrigger, SelectItem, SelectValue } from '@/components/ui/select';
import { MultiSelect } from '@/components/multi-select';
import type { User, Category, Skill } from '@/types';
import type { MultiSelectOption } from '@/components/multi-select';
import { toast } from 'sonner';

export default function ProfessionalInfoForm({ 
    user, 
    categories, 
    skills 
}: { 
    user: User;
    categories: Category[];
    skills: Skill[];
}) {
    // Transform categories and skills to MultiSelectOption format
    const categoryOptions: MultiSelectOption[] = categories.map((category) => ({
        label: category.name,
        value: category.id.toString(),
    }));

    const skillOptions: MultiSelectOption[] = skills.map((skill) => ({
        label: skill.name,
        value: skill.id.toString(),
    }));

    // Initialize with existing user selections
    const [selectedCategoryValues, setSelectedCategoryValues] = useState<string[]>(
        user.categories?.map((category) => category.id.toString()) || []
    );
    const [selectedSkillValues, setSelectedSkillValues] = useState<string[]>(
        user.skills?.map((skill) => skill.id.toString()) || []
    );

    const handleCategoryChange = (values: string[]) => {
        setSelectedCategoryValues(values);
    };

    const handleSkillChange = (values: string[]) => {
        setSelectedSkillValues(values);
    };

    return (
        <Form
            method="patch"
            options={{ preserveScroll: true }}
            action={route('profile.update.professional')}
            onSuccess={() => toast.success('Professional information updated')}
            onError={(errors: Record<string, string>) => {
                if (errors && Object.keys(errors).length) {
                    const first = Object.values(errors)[0] as string;
                    toast.error(first);
                }
            }}
            className="space-y-6"
        >
            {({ processing, recentlySuccessful, errors }) => (
                <>
                    <div className="grid gap-2">
                        <Label htmlFor="profession">Profession</Label>
                        <Input
                            id="profession"
                            className="mt-1 block w-full"
                            defaultValue={user.profession}
                            name="profession"
                            autoComplete="profession"
                            placeholder="Profession"
                        />
                        <InputError className="mt-2" message={errors.profession} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="role">Role</Label>
                        <Select name="role" defaultValue={user.role}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select your role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="provider">Provider</SelectItem>
                                <SelectItem value="client">Client</SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError className="mt-2" message={errors.role} />
                    </div>

                    <div className='grid gap-2'>
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                            id="bio"
                            name="bio"
                            placeholder='Write something about yourself'
                            className="mt-1 block w-full"
                            defaultValue={user.bio}
                        />
                        <InputError className="mt-2" message={errors.bio} />
                    </div>

                    {/* Categories Selection */}
                    <div className="grid gap-2">
                        <Label htmlFor="categories">Categories</Label>
                        <MultiSelect
                            options={categoryOptions}
                            onValueChange={handleCategoryChange}
                            defaultValue={selectedCategoryValues}
                            placeholder="Select categories..."
                            maxCount={4}
                            searchable={true}
                            className="w-full"
                            emptyIndicator="No categories found."
                            variant="default"
                            animationConfig={{
                                badgeAnimation: "bounce",
                                popoverAnimation: "scale",
                                duration: 0.3,
                            }}
                        />
                        <InputError className="mt-2" message={errors.categories} />
                    </div>

                    {/* Skills Selection */}
                    <div className="grid gap-2">
                        <Label htmlFor="skills">Skills</Label>
                        <MultiSelect
                            options={skillOptions}
                            onValueChange={handleSkillChange}
                            defaultValue={selectedSkillValues}
                            placeholder="Select skills..."
                            maxCount={5}
                            searchable={true}
                            className="w-full"
                            emptyIndicator="No skills found."
                            variant="default"
                            animationConfig={{
                                badgeAnimation: "bounce",
                                popoverAnimation: "fade",
                                duration: 0.3,
                            }}
                            responsive={{
                                mobile: { maxCount: 3, compactMode: true },
                                tablet: { maxCount: 4 },
                                desktop: { maxCount: 5 }
                            }}
                        />
                        <InputError className="mt-2" message={errors.skills} />
                    </div>

                    {/* Hidden inputs for form submission */}
                    {selectedCategoryValues.map((categoryId) => (
                        <input 
                            key={`category-${categoryId}`} 
                            type="hidden" 
                            name="categories[]" 
                            value={categoryId} 
                        />
                    ))}
                    {selectedSkillValues.map((skillId) => (
                        <input 
                            key={`skill-${skillId}`} 
                            type="hidden" 
                            name="skills[]" 
                            value={skillId} 
                        />
                    ))}

                    <div className="flex items-center gap-4">
                        <Button disabled={processing}>Save Changes</Button>
                        <Transition
                            show={recentlySuccessful}
                            enter="transition ease-in-out"
                            enterFrom="opacity-0"
                            leave="transition ease-in-out"
                            leaveTo="opacity-0"
                        >
                            <p className="text-sm text-neutral-600">Saved</p>
                        </Transition>
                    </div>
                </>
            )}
        </Form>
    );
}