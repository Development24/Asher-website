// const { mutate: startApplication } = useStartApplication();
// const { mutate: residentApplication } = useResidentApplication();
// const { mutate: employerApplication } = useEmployerApplication();
// const { mutate: emergencyContactApplication } =
//   useEmergencyContactApplication();
// const { mutate: additionalDetailsApplication } =
//   useAdditionalDetailsApplication();
// const { mutate: refereesApplication } = useRefereesApplication();
// const { mutate: guarantorApplication } = useGuarantorApplication();
// const { mutate: documentsApplication } = useDocumentsApplication();
// const { mutate: declarationApplication } = useDeclarationApplication();

// const handleFinalStep = async () => {
//   const payload = {
//     propertyId: propertyId.toString(),
//     applicationId: formData.applicationId,
//     data: formData
//   };
//   const result = await Promise.allSettled([
//     startApplication(payload),
//     residentApplication(payload),
//     employerApplication(payload),
//     emergencyContactApplication(payload),
//     additionalDetailsApplication(payload),
//     refereesApplication(payload),
//     guarantorApplication(payload),
//     documentsApplication(payload),
//     declarationApplication(payload)
//   ]);

//   const isAllSuccess = result.every((res) => res.status === "fulfilled");

//   if (isAllSuccess) {
//     setShowPaymentModal(true);
//   } else {
//     // Optional: Handle errors
//     const errors = result
//       .filter((res) => res.status === "rejected")
//       .map((res) => (res as PromiseRejectedResult).reason);
//   }
// };

// async function onSubmit(values: DocumentsFormValues) {
//     try {
//       // Collect all files into an array, filtering out null values
//       const files = Object.entries(values)
//         .filter(([_, file]) => file !== null)
//         .map(([key, file]) => ({
//           fieldName: key,
//           file: file as File
//         }));
//       onNext();

//       // Upload all files at once
//       const uploadResponse = await uploadFiles(files.map((f) => f.file));

//       // Match uploaded URLs with their corresponding fields
//       const documentUrls = files.reduce(
//         (acc, { fieldName }, index) => ({
//           ...acc,
//           [fieldName]: {
//             name: files[index].file.name,
//             type: files[index].file.type,
//             url: uploadResponse[index].url, // Assuming response has same order as files
//             size: files[index].file.size
//           }
//         }),
//         {}
//       );
//       return
//       // Update form data with cloud URLs
//       // updateFormData({ documents: documentUrls });

//       // Prepare payload for API
//       const payload = {
//         applicationId: applicationId,
//         data: documentUrls
//       };

//       return;
//       // Submit to your application API
//       documentsApplication(payload);

//       onNext();
//     } catch (error) {
//       // Handle error (show toast, etc.)
//     }
//   }