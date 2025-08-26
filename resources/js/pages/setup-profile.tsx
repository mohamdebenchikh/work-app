import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SelectRoleStep from "@/components/setup-profile-steps/select-role-step";
import SelectLocationStep from "@/components/setup-profile-steps/select-location-step";
import SelectPhoneStep from "@/components/setup-profile-steps/select-phone-step";
import PersonalInfoStep from "@/components/setup-profile-steps/personal-info-step";
import SelectAvatarStep from "@/components/setup-profile-steps/select-avatar-step";
import ProfessionalInfoStep from "@/components/setup-profile-steps/professional-info-step";
import BioStep from "@/components/setup-profile-steps/bio-step";
import SkillsCategoriesStep from "@/components/setup-profile-steps/skills-categories-step";
import CompleteStep from "@/components/setup-profile-steps/complete-step";
import { Category, Skill, User } from "@/types";

// Animation variants for smooth transitions
const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
    scale: 0.95,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
    scale: 0.95,
  }),
};

const transition = {
  x: { type: "spring" as const, stiffness: 300, damping: 30 },
  opacity: { duration: 0.2 },
  scale: { duration: 0.2 },
};

interface Props {
  user: User;
  categories?: Category[];
  skills?: Skill[];
}

export default function SetupProfile({ user, categories = [], skills = [] }: Props) {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [direction, setDirection] = useState<number>(0);
  const [userData] = useState(user);
  

  const steps = [
    { 
      component: SelectRoleStep, 
      title: "Select Your Role",
      props: { 
        user: userData, 
        isRequired: true,
        route: 'setup-profile.set-role'
      },
      required: true
    },
    { 
      component: SelectLocationStep, 
      title: "Share Your Location",
      props: { 
        user: userData, 
        isRequired: true,
        route: 'setup-profile.set-location'
      },
      required: true
    },
    { 
      component: SelectPhoneStep, 
      title: "Add Your Phone Number",
      props: { 
        user: userData, 
        isRequired: false,
        route: 'setup-profile.set-phone'
      },
      required: false
    },
    { 
      component: PersonalInfoStep, 
      title: "Personal Information",
      props: { 
        user: userData, 
        isRequired: true,
        route: 'setup-profile.set-personal-info'
      },
      required: true
    },
    { 
      component: SelectAvatarStep, 
      title: "Select Your Avatar",
      props: { 
        user: userData, 
        isRequired: false,
        route: 'setup-profile.set-avatar'
      },
      required: false
    },
    { 
      component: ProfessionalInfoStep, 
      title: "Professional Information",
      props: { 
        user: userData, 
        isRequired: (userData?.role === 'provider'),
        conditionalText: "Required for service providers",
        route: 'setup-profile.set-professional-info'
      },
      required: (userData?.role === 'provider')
    },
    { 
      component: BioStep, 
      title: "Tell Us About Yourself",
      props: { 
        user: userData, 
        isRequired: false,
        route: 'setup-profile.set-bio'
      },
      required: false
    },
    { 
      component: SkillsCategoriesStep, 
      title: "Skills & Categories",
      props: { 
        user: userData, 
        categories: categories,
        skills: skills,
        isRequired: (userData?.role === 'provider'),
        conditionalText: "Required for service providers",
        route: 'setup-profile.set-skills-categories'
      },
      required: (userData?.role === 'provider')
    },
    { 
      component: CompleteStep, 
      title: "Complete Setup",
      props: { 
        user: userData, 
        isRequired: true,
        route: 'setup-profile.complete'
      },
      required: true
    },
  ];

  const totalSteps = steps.length;

  const handleStepChange = (newStep: number): void => {
    if (newStep < 0 || newStep >= totalSteps) return;
    
    setDirection(newStep > currentStep ? 1 : -1);
    setCurrentStep(newStep);
  };

  const goToPreviousStep = (): void => {
    handleStepChange(currentStep - 1);
  };

  const goToNextStep = (): void => {
    // Clear previous errors
    handleStepChange(currentStep + 1);

  };

  const CurrentStepComponent = steps[currentStep].component;
  const stepProps = steps[currentStep].props;

  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      
      {/* Step Content Container */}
      <div className="relative w-full max-w-md overflow-hidden">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentStep}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={transition}
          >
            <CurrentStepComponent
              onNext={goToNextStep}
              onPrevious={currentStep > 0 ? goToPreviousStep : undefined}
              {...stepProps}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}