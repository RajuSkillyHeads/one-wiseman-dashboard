// Utility functions for data processing

export function parseTime(maybeTimeObj) {
  if (!maybeTimeObj) return null;
  if (typeof maybeTimeObj === 'string') return new Date(maybeTimeObj);
  if (maybeTimeObj.__time__) return new Date(maybeTimeObj.__time__);
  return null;
}

export function formatDate(maybeTimeObj) {
  const d = parseTime(maybeTimeObj);
  return d ? d.toLocaleString() : '';
}

export function formatDateOnly(d) {
  if (!d) return '';
  return new Date(d).toISOString().slice(0, 10);
}

export function average(nums) {
  if (!nums || nums.length === 0) return 0;
  const sum = nums.reduce((a, b) => a + (Number.isFinite(b) ? b : 0), 0);
  return sum / nums.length;
}

export function safeArray(obj) {
  return Array.isArray(obj) ? obj : [];
}

export function normalizeEmail(email) {
  if (!email) return '';
  return email.toString().replaceAll('"', '').trim().toLowerCase();
}

export function aggregateKPIs(db, selectedClientId = 'all') {
  console.log('aggregateKPIs called with:', { selectedClientId, dbKeys: Object.keys(db || {}) });
  
  const getClientIds = () => {
    if (selectedClientId === 'all') return Object.keys(db.clients || {});
    return Object.keys(db.clients || {}).filter(id => id === selectedClientId);
  };

  const clientIds = getClientIds();
  console.log('Client IDs:', clientIds);

  const allBatches = [];
  const allAssignments = new Map();
  const allAssessments = new Map();
  const allQuestions = new Map();
  const allUsers = Object.entries(db.users || {});

  // clients → batches
  for (const clientId of clientIds) {
    const client = (db.clients || {})[clientId] || {};
    const batches = client.batches || {};
    for (const [batchId, batch] of Object.entries(batches)) {
      allBatches.push({ clientId, batchId, batch });

      // batch-level assignments
      const bAssign = batch.assignments || {};
      for (const [aId, a] of Object.entries(bAssign)) {
        allAssignments.set(`${clientId}::batch::${batchId}::${aId}`, { clientId, scope: 'batch', batchId, id: aId, item: a });
      }
      // batch-level assessments
      const bAssess = batch.assessments || {};
      for (const [asId, as] of Object.entries(bAssess)) {
        allAssessments.set(`${clientId}::batch::${batchId}::${asId}`, { clientId, scope: 'batch', batchId, id: asId, item: as });
      }
    }

    // client-level assignments
    const cAssign = client.assignments || {};
    for (const [aId, a] of Object.entries(cAssign)) {
      allAssignments.set(`${clientId}::client::${aId}`, { clientId, scope: 'client', id: aId, item: a });
    }
    // client-level assessments
    const cAssess = (client.assessments || {});
    for (const [asId, as] of Object.entries(cAssess)) {
      allAssessments.set(`${clientId}::client::${asId}`, { clientId, scope: 'client', id: asId, item: as });
    }

    // client-level questions
    const cQuestions = (client.questions || {});
    for (const [qId, q] of Object.entries(cQuestions)) {
      allQuestions.set(`client::${clientId}::${qId}`, { source: 'client', clientId, id: qId, item: q });
    }
  }

  // global questions
  for (const [qId, q] of Object.entries(db.questions || {})) {
    allQuestions.set(`global::${qId}`, { source: 'global', clientId: '', id: qId, item: q });
  }

  // submissions & score metrics
  const submissionsRoot = db.submissions || {};
  console.log('Submissions root:', Object.keys(submissionsRoot));
  
  let submissionCount = 0;
  const completenessVals = [];
  const qualityVals = [];
  const submissionsByDay = new Map(); // yyyy-mm-dd -> count
  let assignmentsCountBySub = 0;
  let assessmentsCountBySub = 0;
  const recent = [];

  for (const clientId of clientIds) {
    const subClient = submissionsRoot[clientId] || {};
    console.log(`Processing submissions for client ${clientId}:`, Object.keys(subClient));
    
    const collections = ['assignments', 'assessments'];
    for (const coll of collections) {
      const byScope = subClient[coll] || {};
      console.log(`  ${coll} scopes:`, Object.keys(byScope));
      
      for (const [scopeId, userMapOrArr] of Object.entries(byScope)) {
        // scopeId = assignment_1 or assessment_1
        console.log(`    Processing ${scopeId}:`, Object.keys(userMapOrArr));
        
        for (const [_userEmail, submissions] of Object.entries(userMapOrArr)) {
          const arr = safeArray(submissions);
          console.log(`      User submissions count: ${arr.length}`);
          
          for (const sub of arr) {
            submissionCount += 1;
            const date = parseTime(sub.submission_date);
            const bucket = formatDateOnly(date || new Date());
            submissionsByDay.set(bucket, (submissionsByDay.get(bucket) || 0) + 1);

            const results = sub.results || {};
            for (const q of Object.values(results)) {
              const c = Number(q.completeness_percentage);
              const ql = Number(q.quality_percentage);
              if (Number.isFinite(c)) completenessVals.push(c);
              if (Number.isFinite(ql)) qualityVals.push(ql);
            }

            // split counts
            if (coll === 'assignments') assignmentsCountBySub += 1; else assessmentsCountBySub += 1;

            // recent row
            const perQuestion = Object.values(results).map(r => ({ c: Number(r.completeness_percentage), q: Number(r.quality_percentage) }));
            const avgC = average(perQuestion.map(x => x.c));
            const avgQ = average(perQuestion.map(x => x.q));
            recent.push({
              dateMs: date ? date.getTime() : 0,
              clientId,
              scope: coll,
              id: scopeId,
              user: sub.user_email || '',
              version: sub.version || '',
              focusLoss: Number(sub.focus_loss_count || 0),
              pastes: Number(sub.paste_count || 0),
              avgCompleteness: avgC || 0,
              avgQuality: avgQ || 0,
            });
          }
        }
      }
    }
  }

  const avgCompleteness = average(completenessVals);
  const avgQuality = average(qualityVals);
  recent.sort((a, b) => b.dateMs - a.dateMs);
  const recentSubmissions = recent.slice(0, 15);

  // question type counts (global + client)
  const qTypeCounts = {};
  function addQ(q) { const t = (q.type || 'unknown'); qTypeCounts[t] = (qTypeCounts[t] || 0) + 1; }
  for (const v of allQuestions.values()) { addQ(v.item); }

  const result = {
    clientsCount: getClientIds().length,
    batchesCount: allBatches.length,
    assignmentsCount: allAssignments.size,
    assessmentsCount: allAssessments.size,
    questionsCount: allQuestions.size,
    usersCount: allUsers.length,
    submissionCount,
    avgCompleteness,
    avgQuality,
    submissionsByDay,
    assignmentsCountBySub,
    assessmentsCountBySub,
    questionTypeCounts: qTypeCounts,
    recentSubmissions,
    collections: { allBatches, allAssignments, allAssessments, allQuestions, allUsers },
  };

  console.log('aggregateKPIs result:', {
    submissionCount,
    avgCompleteness,
    avgQuality,
    submissionsByDaySize: submissionsByDay.size,
    assignmentsCountBySub,
    assessmentsCountBySub,
    questionTypeCounts: qTypeCounts
  });

  return result;
}

export function collectUserSubmissions(db, userEmailNormalized) {
  const out = [];
  const submissionsRoot = db.submissions || {};
  for (const [clientId, clientSubs] of Object.entries(submissionsRoot)) {
    for (const coll of ['assignments', 'assessments']) {
      const byScope = clientSubs[coll] || {};
      for (const [scopeId, userMap] of Object.entries(byScope)) {
        for (const [userEmail, submissions] of Object.entries(userMap || {})) {
          if (normalizeEmail(userEmail) !== userEmailNormalized) continue;
          for (const sub of safeArray(submissions)) {
            const dateObj = parseTime(sub.submission_date);
            const results = sub.results || {};
            const perQuestion = Object.values(results).map(r => ({ c: Number(r.completeness_percentage), q: Number(r.quality_percentage) }));
            const avgC = average(perQuestion.map(x => x.c));
            const avgQ = average(perQuestion.map(x => x.q));
            out.push({
              dateMs: dateObj ? dateObj.getTime() : 0,
              clientId,
              scope: coll,
              id: scopeId,
              version: sub.version || '',
              focusLoss: Number(sub.focus_loss_count || 0),
              pastes: Number(sub.paste_count || 0),
              avgCompleteness: avgC || 0,
              avgQuality: avgQ || 0,
            });
          }
        }
      }
    }
  }
  out.sort((a, b) => b.dateMs - a.dateMs);
  return out;
}
