import * as z from "zod"

export const checklistSchema = z.object({
  checklist: z.record(z.string(), z.boolean()).refine(
    (checklist) => {
      return Object.values(checklist).every((value) => value === true)
    },
    {
      message: "All items must be checked",
    }
  ),
})

export type ChecklistFormValues = z.infer<typeof checklistSchema> 