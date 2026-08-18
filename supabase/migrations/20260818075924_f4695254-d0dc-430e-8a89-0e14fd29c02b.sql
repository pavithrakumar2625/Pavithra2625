
CREATE POLICY "anyone can view portfolio media" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'portfolio-media');
CREATE POLICY "owner uploads portfolio media" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'portfolio-media' AND public.is_admin());
CREATE POLICY "owner updates portfolio media" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'portfolio-media' AND public.is_admin());
CREATE POLICY "owner deletes portfolio media" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'portfolio-media' AND public.is_admin());
