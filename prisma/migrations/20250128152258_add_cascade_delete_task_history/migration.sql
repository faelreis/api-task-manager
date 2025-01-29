-- DropForeignKey
ALTER TABLE "task_history" DROP CONSTRAINT "task_history_task_id_fkey";

-- AddForeignKey
ALTER TABLE "task_history" ADD CONSTRAINT "task_history_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "Tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
