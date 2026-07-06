import {useDocumentOperation} from 'sanity'
import type {DocumentActionComponent} from 'sanity'

export const ApproveAndPublishAction: DocumentActionComponent = (props) => {
  const {patch, publish} = useDocumentOperation(props.id, props.type)
  const draft = props.draft

  const hasBody = Array.isArray(draft?.body) && draft.body.length > 0
  const canPublish = draft?.approvalStatus === 'ready' && hasBody

  return {
    label: canPublish ? 'Approve & Publish' : 'Waiting for automation',
    disabled: !canPublish || Boolean(publish.disabled),
    onHandle: () => {
      patch.execute([
        {
          set: {
            approvalStatus: 'approved',
            status: 'published',
          },
          setIfMissing: {
            publishedAt: new Date().toISOString(),
          },
        },
      ])
      publish.execute()
      props.onComplete()
    },
  }
}
