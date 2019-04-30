import { use } from '../utils';
import { emit, inherit } from '../utils/functional';
import { routeProps, RouteProps, functionalRoute } from '../utils/router';
import Loading from '../loading';

// Types
import { CreateElement, RenderContext } from 'vue/types';
import { DefaultSlots } from '../utils/use/sfc';

export type ButtonProps = RouteProps & {
  tag: keyof HTMLElementTagNameMap | string;
  type: 'default' | 'primary' | 'info' | 'warning' | 'danger';
  size: 'large' | 'normal' | 'small' | 'mini';
  text?: string;
  block?: boolean;
  plain?: boolean;
  round?: boolean;
  square?: boolean;
  loading?: boolean;
  hairline?: boolean;
  disabled?: boolean;
  nativeType?: string;
  loadingSize: string;
  loadingText?: string;
  bottomAction?: boolean;
};

export type ButtonEvents = {
  onClick?(event: Event): void;
};

// use() 返回的是一个数组 [useSFC(name), useBEM(name), useI18N(name)]
// 即这里的 sfc = useSFC('button')，因 useSFC 是多箭头函数
// 所以，这里 sfc = (sfc) => {...}
// 在此文件中最后返回 export sfc(Button)，即上面的入参 sfc 即为 这里的 Button 函数
// 在 use 目录下的 sfc.ts 中如果入参sfc是 function(这里就是)，调用的是transformFunctionComponent，如下

// function transformFunctionComponent(
//   pure: FunctionComponent
// ): VantComponentOptions {
//   return {
//     functional: true,
//     props: pure.props,
//     model: pure.model,
//     render: (h, context): any =>
//       pure(h, context.props, unifySlots(context), context)
//   };
// }
const [sfc, bem] = use('button');

function Button(
  h: CreateElement,
  props: ButtonProps,
  slots: DefaultSlots,
  ctx: RenderContext<ButtonProps>
) {
  const { tag, type, disabled, loading, hairline, loadingText } = props;

  const onClick = (event: Event) => {
    if (!loading && !disabled) {
      emit(ctx, 'click', event);
      functionalRoute(ctx);
    }
  };

  const onTouchstart = (event: TouchEvent) => {
    emit(ctx, 'touchstart', event);
  };

  const classes = [
    bem([
      type,
      props.size,
      {
        loading,
        disabled,
        hairline,
        block: props.block,
        plain: props.plain,
        round: props.round,
        square: props.square,
        'bottom-action': props.bottomAction
      }
    ]),
    { 'van-hairline--surround': hairline }
  ];

  return (
    <tag
      class={classes}
      type={props.nativeType}
      disabled={disabled}
      onClick={onClick}
      onTouchstart={onTouchstart}
      {...inherit(ctx)}
    >
      {loading ? (
        [
          <Loading
            size={props.loadingSize}
            color={type === 'default' ? undefined : ''}
          />,
          loadingText && <span class={bem('loading-text')}>{loadingText}</span>
        ]
      ) : (
        <span class={bem('text')}>{slots.default ? slots.default() : props.text}</span>
      )}
    </tag>
  );
}

Button.props = {
  ...routeProps,
  text: String,
  block: Boolean,
  plain: Boolean,
  round: Boolean,
  square: Boolean,
  loading: Boolean,
  hairline: Boolean,
  disabled: Boolean,
  nativeType: String,
  loadingText: String,
  bottomAction: Boolean,
  tag: {
    type: String,
    default: 'button'
  },
  type: {
    type: String,
    default: 'default'
  },
  size: {
    type: String,
    default: 'normal'
  },
  loadingSize: {
    type: String,
    default: '20px'
  }
};

export default sfc<ButtonProps, ButtonEvents>(Button);
