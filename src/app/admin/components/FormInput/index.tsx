// import { extendVariants, Input as InputHeroUI } from "@heroui/react";
// import { PropsWithChildren } from "react";
// import type { InputProps } from "@heroui/react";
// import {
//   FieldPath,
//   FieldValues,
//   useController,
//   type Control,
//   type RegisterOptions,
// } from "react-hook-form";
// import Button from "../Buttons";

// const Input = extendVariants(HeroUIInput, {
//   variants: {
//     color: {
//       default: {
//         inputWrapper: [
//           "text-grey-400",
//           "bg-light",
//           "border",
//           "border-grey-300",
//           "data-[hover=true]:border-primary-600",
//           "data-[hover=true]:bg-light",
//           "data-[active=true]:bg-light",
//           "group-data-[focus=true]:bg-grey-50",
//           "group-data-[has-value=true]:text-grey-400",
//           "data-disabled:text-grey-300",
//         ],
//         input: ["text-grey-400"],
//         label: ["text-grey-400"],
//         errorMessage: ["text-danger-600"],
//       },
//       primary: {
//         inputWrapper: [
//           "bg-light",
//           "border",
//           "border-primary-700",
//           "data-[hover=true]:border-primary-700",
//           "data-[hover=true]:bg-light",
//           "group-data-[focus=true]:bg-grey-50",
//           "text-black",
//         ],
//       },
//     },
//     size: {
//       sm: {
//         inputWrapper: "h-10 px-3",
//         label: "text-body1",
//         input: "text-body1",
//       },
//       md: {
//         inputWrapper: "h-[2.75rem] px-3",
//         label: "text-body1",
//         input: "text-body1",
//       },
//       lg: {
//         inputWrapper: "h-14 px-3",
//         label: "text-body1",
//         input: "text-body1",
//       },
//     },
//     radius: {
//       sm: {
//         inputWrapper: "rounded-sm",
//       },
//       lg: {
//         inputWrapper: "rounded-lg",
//       },
//     },
//     textSize: {
//       base: {
//         input: "text-body1",
//         label: "text-body1",
//       },
//     },
//     isDisabled: {
//       true: {
//         inputWrapper: "bg-light pointer-events-none",
//       },
//     },
//     isInvalid: {
//       true: {
//         inputWrapper: [
//           "!bg-light",
//           "!border-danger-600",
//           "group-data-[focus=true]:!bg-grey-50",
//           "data-[hover=true]:!bg-light",
//         ],
//         label: "!text-danger-600",
//       },
//     },
//   },
//   defaultVariants: {
//     color: "default",
//     textSize: "base",
//     size: "md",
//     radius: "sm",
//   },
// });

// interface Props<T extends FieldValues> extends InputProps {
//   control: Control<T>;
//   name: FieldPath<T>;
//   rules?: Exclude<
//     RegisterOptions<T>,
//     "valueAsNumber" | "valueAsDate" | "setValueAs"
//   >;
//   disabled?: boolean;
// }

// function FormInput<T extends FieldValues>({
//   type,
//   label,
//   control,
//   name,
//   rules,
//   labelPlacement,
//   placeholder,
//   radius,
//   color,
//   size,
//   disabled,
//   isClearable,
//   startContent,
//   endContent,
//   ...rest
// }: PropsWithChildren<Props<T>>) {
//   const {
//     field,
//     fieldState: { invalid, error },
//   } = useController({ name, control, rules });

//   if (type === "file") {
//     return (
//       <div>
//         <Button type="button" className="flex items-center justify-center">
//           <label htmlFor={rest.id} className="h-full w-full">
//             hi
//           </label>
//         </Button>

//         <div style={{ display: "none" }}>
//           <Input
//             color={color}
//             size={size}
//             type={type}
//             label={label}
//             name={field.name}
//             onChange={field.onChange}
//             onBlur={field.onBlur}
//             value={field.value || ""}
//             // ref={field.ref}
//             labelPlacement={labelPlacement}
//             placeholder={placeholder}
//             errorMessage={error?.message}
//             isInvalid={invalid}
//             isDisabled={disabled}
//             isClearable={isClearable}
//             radius={radius}
//             startContent={startContent}
//             endContent={endContent}
//             {...rest}
//           />
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <Input
//         color={color}
//         size={size}
//         type={type}
//         label={label}
//         name={field.name}
//         onChange={field.onChange}
//         onBlur={field.onBlur}
//         value={field.value || ""}
//         ref={field.ref}
//         labelPlacement={labelPlacement}
//         placeholder={placeholder}
//         errorMessage={error?.message}
//         isInvalid={invalid}
//         isDisabled={disabled}
//         isClearable={isClearable}
//         radius={radius}
//         startContent={startContent}
//         endContent={endContent}
//         {...rest}
//       />
//     </div>
//   );
// }

// export default FormInput;
