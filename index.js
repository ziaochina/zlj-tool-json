import pkgJson from './package.json'
import { actionMixin, registerComponent } from 'maka'
import { Controlled as CodeMirror } from 'react-codemirror2'
import JsonViewer from 'react-json-view'
import JSON5 from 'json5'
import beautify from 'js-beautify/js/lib/beautifier.min'

import "codemirror/theme/material.css"
import "codemirror/lib/codemirror.css"
import './style.less'

const name = pkgJson.name

registerComponent('CodeMirror', CodeMirror)
registerComponent('JsonViewer', JsonViewer)

const state = {
    data: {
        json: `
{
    component: 'div',
    className: 'zlj-tool-json',
    children: [{
        component: 'div',
        className: 'zlj-tool-json-left',
        children: [{
            component: 'CodeMirror',
            options: {
                mode: 'json',
                theme: 'material',
                lineNumbers: true
            },
            value: '{{data.json}}',
            onBeforeChange: '{{$onChange}}'
        }, {
            component: 'div',
            className: 'zlj-tool-json-left-function',
            children: [{
                component: 'button',
                type: 'button',
                children: 'beautify',
                onClick: '{{$beautify(data)}}'
            }]
        }]
    }, {
        component: 'div',
        className: 'zlj-tool-json-center',
    }, {
        component: 'div',
        className: 'zlj-tool-json-right',
        children: {
            component: 'JsonViewer',
            theme: 'monokai',
            displayDataTypes: false,
            name: false,
            onAdd: '{{$onViewerChange}}',
            onEdit: '{{$onViewerChange}}',
            onDelete: '{{$onViewerChange}}',
            src: '{{$getViewerSrc(data)}}'
        }
    }]
}
`
    }
}

@actionMixin('base')
class action {
    constructor(option) {
        Object.assign(this, option.mixins)
    }

    onChange = (a, b, v) => {
        this.base.setState({
            'data.json': v
        })
    }

    onViewerChange = (e) => {
        this.base.setState({
            'data.json': beautify.js(JSON.stringify(e.updated_src))
        })
    }

    getViewerSrc = (data) => {
        var json = {}
        try {
            json = JSON5.parse(data.json)
        }
        catch (e) {
            json = { error: e.message }
        }
        json._notParse = true
        return json
    }

    beautify = (data) => (e) => {
        var json = JSON5.parse(data.json)
        var str = beautify.js(JSON.stringify(json), { indent_size: 4 })
        this.base.setState({ 'data.json': str })
    }
}

const view = {
    component: 'div',
    className: 'zlj-tool-json',
    children: [{
        component: 'div',
        className: 'zlj-tool-json-left',
        children: [{
            component: 'CodeMirror',
            options: {
                mode: 'json',
                theme: 'material',
                lineNumbers: true
            },
            value: '{{data.json}}',
            onBeforeChange: '{{$onChange}}'
        }, {
            component: 'div',
            className: 'zlj-tool-json-left-function',
            children: [{
                component: 'button',
                type: 'button',
                children: 'beautify',
                onClick: '{{$beautify(data)}}'
            }]
        }]
    }, {
        component: 'div',
        className: 'zlj-tool-json-center',
    }, {
        component: 'div',
        className: 'zlj-tool-json-right',
        children: {
            component: 'JsonViewer',
            theme: 'monokai',
            displayDataTypes: false,
            name: false,
            onAdd: '{{$onViewerChange}}',
            onEdit: '{{$onViewerChange}}',
            onDelete: '{{$onViewerChange}}',
            src: '{{$getViewerSrc(data)}}'
        }
    }]
}

export {
    name,
    state,
    action,
    view
}