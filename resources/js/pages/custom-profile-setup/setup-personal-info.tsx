import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useForm } from "@inertiajs/react";
import { Calendar, Loader2 } from "lucide-react";
import CustomProfileSetUpLayout from "@/layouts/custom-profile-setup-layout";
import InputError from "@/components/input-error";

export default function SetupPersonalInfo({canSkip,nextStepUrl}: {canSkip?: boolean; nextStepUrl?: string;}) {
  const { data, setData, post, processing, errors } = useForm({
    gender: "",
    birthdate: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('profile-setup.personal-info'));
  };

  // Calculate max date (20 years ago from 2025)
  const getMaxDate = () => {
    return "2005-12-31";
  };

  return (
    <CustomProfileSetUpLayout
      title="Complete Your Profile"
      description="Help us personalize your experience by sharing some information about yourself"
      canSkip={canSkip}
      nextStepUrl={nextStepUrl}
    >
      <form onSubmit={handleSubmit} className="space-y-6 mb-3">
        <div className="grid gap-2">
          <Label htmlFor="gender" className="text-slate-700 dark:text-slate-300">
            Gender
          </Label>
          <Select
            value={data.gender}
            onValueChange={(value) => setData('gender', value)}
          >
            <SelectTrigger className="border-slate-200 w-full dark:border-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400">
              <SelectValue placeholder="Select your gender" />
            </SelectTrigger>
            <SelectContent className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
              <SelectItem value="male" className="focus:bg-blue-50 dark:focus:bg-blue-900/20">Male</SelectItem>
              <SelectItem value="female" className="focus:bg-blue-50 dark:focus:bg-blue-900/20">Female</SelectItem>
            </SelectContent>
          </Select>
         {errors.gender && <InputError message={errors.gender} />}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="birthdate" className="text-slate-700 dark:text-slate-300">
            Date of Birth
          </Label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Calendar className="h-4 w-4 text-slate-400" />
            </div>
            <Input
              id="birthdate"
              type="date"
              value={data.birthdate}
              onChange={(e) => setData('birthdate', e.target.value)}
              className="pl-10 border-slate-200 dark:border-slate-700 focus:ring-blue-600"
              max={getMaxDate()}
            />
          </div>
          {errors.birthdate && <InputError message={errors.birthdate} />}
        </div>

        <div className="flex flex-col gap-3 pt-4">
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            disabled={processing}
          >
            {processing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Information"
            )}
          </Button>
        </div>
      </form>
    </CustomProfileSetUpLayout>
  );
}