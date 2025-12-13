/*
  # タスク管理テーブルの作成

  1. 新しいテーブル
    - `tasks`
      - `id` (uuid, primary key) - タスクの一意識別子
      - `user_id` (uuid, foreign key to auth.users) - タスクを作成したユーザー
      - `destination_name` (text) - 目的地名（例: スターバックス渋谷店）
      - `destination_address` (text) - 目的地の住所
      - `destination_lat` (double precision) - 目的地の緯度
      - `destination_lng` (double precision) - 目的地の経度
      - `target_date_time` (timestamptz) - 目標到着日時
      - `penalty_amount` (integer) - 罰金額（円）
      - `stripe_payment_method_id` (text, nullable) - Stripe決済メソッドID
      - `stripe_payment_intent_id` (text, nullable) - Stripe決済インテントID
      - `gps_activation_time` (timestamptz, nullable) - GPS監視開始時刻
      - `status` (text) - タスクのステータス（pending, active, completed, failed）
      - `created_at` (timestamptz) - 作成日時
      - `completed_at` (timestamptz, nullable) - 完了日時
      - `check_in_lat` (double precision, nullable) - チェックイン時の緯度
      - `check_in_lng` (double precision, nullable) - チェックイン時の経度
      - `check_in_time` (timestamptz, nullable) - チェックイン時刻

  2. セキュリティ
    - tasksテーブルでRLSを有効化
    - ユーザーは自分のタスクのみ閲覧可能
    - ユーザーは自分のタスクのみ作成可能
    - ユーザーは自分のタスクのみ更新可能
    - ユーザーは自分のタスクのみ削除可能

  3. インデックス
    - user_idとstatusに対するインデックスを作成（パフォーマンス向上）
    - target_date_timeに対するインデックスを作成（GPS監視クエリの最適化）
*/

CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  destination_name text NOT NULL,
  destination_address text NOT NULL,
  destination_lat double precision NOT NULL,
  destination_lng double precision NOT NULL,
  target_date_time timestamptz NOT NULL,
  penalty_amount integer NOT NULL CHECK (penalty_amount >= 500 AND penalty_amount <= 10000),
  stripe_payment_method_id text,
  stripe_payment_intent_id text,
  gps_activation_time timestamptz,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'completed', 'failed')),
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  check_in_lat double precision,
  check_in_lng double precision,
  check_in_time timestamptz
);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own tasks"
  ON tasks FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own tasks"
  ON tasks FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tasks"
  ON tasks FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own tasks"
  ON tasks FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_tasks_user_id_status ON tasks(user_id, status);
CREATE INDEX IF NOT EXISTS idx_tasks_target_date_time ON tasks(target_date_time);
CREATE INDEX IF NOT EXISTS idx_tasks_gps_activation_time ON tasks(gps_activation_time) WHERE gps_activation_time IS NOT NULL;